import cdk = require("@aws-cdk/cdk");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import appsync = require("@aws-cdk/aws-appsync");
import iam = require("@aws-cdk/aws-iam");

// import {
//   CfnUserPool,
//   CfnUserPoolClient,
//   CfnIdentityPool
// } from "@aws-cdk/aws-cognito";

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

    const iam_role = new iam.CfnRole(this, "fbt_ds_role", {
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
      serviceRoleArn: iam_role.roleArn
    });

    console.log(user_table);
    console.log(datasource);

    /*
    const userPool = new CfnUserPool(this, "fbtuserpool", {
      policies: {
        passwordPolicy: {
          minimumLength: 8,
          requireLowercase: false,
          requireNumbers: false,
          requireSymbols: false,
          requireUppercase: false
        }
      }
    });

    const userPoolClient = new CfnUserPoolClient(this, "fbtuserpoolclient", {
      generateSecret: false,
      clientName: "web",
      userPoolId: userPool.userPoolId
    });

    new CfnIdentityPool(this, "findbadtweets_ip", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName
        }
      ]
    });*/
  }
}
