import cdk = require("@aws-cdk/cdk");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import appsync = require("@aws-cdk/aws-appsync");
import iam = require("@aws-cdk/aws-iam");
import {
  CfnUserPool,
  CfnUserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment
} from "@aws-cdk/aws-cognito";
import fs = require("fs");

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const user_table = new dynamodb.Table(this, "fbt_users", {
      partitionKey: { name: "user_id", type: dynamodb.AttributeType.String },
      readCapacity: 1,
      writeCapacity: 1,
      tableName: "fbt_users"
    });

    const api = new appsync.CfnGraphQLApi(this, "fbt_api", {
      authenticationType: "AWS_IAM",
      name: "fbt_api"
    });

    new cdk.CfnOutput(this, "apiendpoint", {
      description: "apiendpoint",
      export: "apiendpoint",
      value: api.graphQlApiGraphQlUrl
    });

    const iam_ds_role = new iam.CfnRole(this, "fbt_ds_role", {
      roleName: "appsync-ds" + api.graphQlApiApiId + "-" + user_table.tableName,
      assumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "appsync.amazonaws.com"
            },
            Action: "sts:AssumeRole"
          }
        ]
      },
      policies: [
        {
          policyName: "myPolicy",
          policyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "dynamodb:DeleteItem",
                  "dynamodb:GetItem",
                  "dynamodb:PutItem",
                  "dynamodb:Query",
                  "dynamodb:Scan",
                  "dynamodb:UpdateItem"
                ],
                Resource: [user_table.tableArn, user_table.tableArn + "/*"]
              }
            ]
          }
        }
      ]
    });

    const datasource = new appsync.CfnDataSource(this, "fbt_api_datasource", {
      apiId: api.graphQlApiApiId,
      name: "users",
      type: "AMAZON_DYNAMODB",
      dynamoDbConfig: {
        tableName: user_table.tableName,
        awsRegion: "us-east-1"
      },
      serviceRoleArn: iam_ds_role.roleArn
    });

    const schemadefinition = fs.readFileSync(
      `${__dirname}/../graphql/schema.graphql`,
      {
        encoding: "utf-8"
      }
    );

    const fbtschema = new appsync.CfnGraphQLSchema(this, "fbt_api_schema", {
      apiId: api.graphQlApiApiId,
      definition: schemadefinition
    });

    const fbtUpdateUserResponseResolver = fs.readFileSync(
      `${__dirname}/../graphql/resolvers/updateUser.response.resolver`,
      { encoding: "utf-8" }
    );

    const fbtUpdateUserRequestResolver = fs.readFileSync(
      `${__dirname}/../graphql/resolvers/updateUser.request.resolver`,
      { encoding: "utf-8" }
    );

    const fbtUpdateUserResolver = new appsync.CfnResolver(
      this,
      "fbt_update_user_resolver",
      {
        apiId: api.graphQlApiApiId,
        fieldName: "updateUser",
        typeName: "Mutation",
        dataSourceName: datasource.dataSourceName,
        requestMappingTemplate: fbtUpdateUserRequestResolver,
        responseMappingTemplate: fbtUpdateUserResponseResolver
      }
    );

    const fbtGetMyProfileResponseResolver = fs.readFileSync(
      `${__dirname}/../graphql/resolvers/getMyProfile.response.resolver`,
      { encoding: "utf-8" }
    );

    const fbtGetMyProfileRequestResolver = fs.readFileSync(
      `${__dirname}/../graphql/resolvers/getMyProfile.request.resolver`,
      { encoding: "utf-8" }
    );

    const fbtGetMyProfileResolver = new appsync.CfnResolver(
      this,
      "fbt_get_my_profile_resolver",
      {
        apiId: api.graphQlApiApiId,
        fieldName: "getMyProfile",
        typeName: "Query",
        dataSourceName: datasource.dataSourceName,
        requestMappingTemplate: fbtGetMyProfileRequestResolver,
        responseMappingTemplate: fbtGetMyProfileResponseResolver
      }
    );

    const fbtGetUserResponseResolver = fs.readFileSync(
      `${__dirname}/../graphql/resolvers/getUser.response.resolver`,
      { encoding: "utf-8" }
    );

    const fbtGetUserRequestResolver = fs.readFileSync(
      `${__dirname}/../graphql/resolvers/getUser.request.resolver`,
      { encoding: "utf-8" }
    );

    new appsync.CfnResolver(this, "fbt_get_user_resolver", {
      apiId: api.graphQlApiApiId,
      fieldName: "getUser",
      typeName: "Query",
      dataSourceName: datasource.dataSourceName,
      requestMappingTemplate: fbtGetUserRequestResolver,
      responseMappingTemplate: fbtGetUserResponseResolver
    });

    const userPool = new CfnUserPool(this, "fbtuserpool", {
      policies: {
        passwordPolicy: {
          minimumLength: 8,
          requireLowercase: false,
          requireNumbers: false,
          requireSymbols: false,
          requireUppercase: false
        }
      },
      usernameAttributes: ["email"],
      autoVerifiedAttributes: ["email"]
    });

    new cdk.CfnOutput(this, "userpoolid", {
      description: "userpoolid",
      export: "userpoolid",
      value: userPool.userPoolId
    });

    new cdk.CfnOutput(this, "cognitoregion", {
      description: "cognitoregion",
      export: "cognitoregion",
      value: "us-east-1"
    });

    new cdk.CfnOutput(this, "projectregion", {
      description: "projectregion",
      export: "projectregion",
      value: "us-east-1"
    });

    const userPoolClient = new CfnUserPoolClient(this, "fbt_userpoolclient", {
      generateSecret: false,
      clientName: "web",
      userPoolId: userPool.userPoolId
    });

    new cdk.CfnOutput(this, "webclientid", {
      description: "webclientid",
      export: "webclientid",
      value: userPoolClient.userPoolClientId
    });

    const identityPool = new CfnIdentityPool(this, "fbt_identitypool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName
        }
      ]
    });

    new cdk.CfnOutput(this, "identitypoolid", {
      description: "identitypoolid",
      export: "identitypoolid",
      value: identityPool.identityPoolId
    });

    const iam_appsync_authrole = new iam.CfnRole(this, "fbt_appsync_authrole", {
      roleName: "appsync-authrole-" + api.graphQlApiApiId,
      assumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "cognito-identity.amazonaws.com"
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud":
                  identityPool.identityPoolId
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "authenticated"
              }
            }
          }
        ]
      },
      policies: [
        {
          policyName: "FindBadTweetsAppsyncPolicy",
          policyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "VisualEditor0",
                Effect: "Allow",
                Action: "appsync:GraphQL",
                Resource: [
                  api.graphQlApiArn,
                  "arn:aws:appsync:*:*:apis/*/types/*/fields/*"
                ]
              }
            ]
          }
        }
      ]
    });

    const iam_appsync_unauthrole = new iam.CfnRole(
      this,
      "fbt_appsync_unauthrole",
      {
        roleName: "appsync-unauthrole-" + api.graphQlApiApiId,
        assumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Federated: "cognito-identity.amazonaws.com"
              },
              Action: "sts:AssumeRoleWithWebIdentity",
              Condition: {
                StringEquals: {
                  "cognito-identity.amazonaws.com:aud":
                    identityPool.identityPoolId
                },
                "ForAnyValue:StringLike": {
                  "cognito-identity.amazonaws.com:amr": "unauthenticated"
                }
              }
            }
          ]
        },
        policies: [
          {
            policyName: "FindBadTweetsAppsyncPolicy",
            policyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: ["mobileanalytics:PutEvents", "cognito-sync:*"],
                  Resource: ["*"]
                }
              ]
            }
          }
        ]
      }
    );

    const identityPoolRoleAttachment = new CfnIdentityPoolRoleAttachment(
      this,
      "fbt_identitypoolroleattachment",
      {
        identityPoolId: identityPool.identityPoolId,
        roles: {
          authenticated: iam_appsync_authrole.roleArn,
          unauthenticated: iam_appsync_unauthrole.roleArn
        }
      }
    );

    console.log(identityPoolRoleAttachment);
    console.log(identityPool);
    console.log(fbtUpdateUserResolver);
    console.log(fbtGetMyProfileResolver);
    console.log(fbtschema);
  }
}
