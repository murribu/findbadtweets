# Setup

1. `git clone https://github.com/murribu/findbadtweets`
1. `yarn`
1. `cd cdk`
1. `yarn`
1. `npm run build` (maybe `yarn build` would work)
1. `cdk synth` (builds the cloudformation template)
1. `cdk deploy` Answer `y` if prompted with an "are you sure?' (this pushes to your aws account)
1. `cdk deploy &> ../cdkdeployresult.txt` This doesn't push to AWS again because there are no changes. It just saves the Outputs to the given txt file.
1. `cd ..`
1. `node parseResults.js cdkdeployresult.txt` This parses that txt file into a json config file

# Local dev

1. Go through the Setup process
1. `yarn start`

# To edit the AWS Stack

1. Make your changes to `cdk/lib/cdk-stack.ts`
1. Look in `exports.sh` for what to run next. Fwiw, running `./exports.sh` doesn't work. But running the lines individually gets the job done. This makes your changes and saves any outputs to the `src/config.js` file. If any of your changes touch IAM (such as your initial deployment), there will be an "Are you sure?" prompt on the `cdk deploy` step. So you should run that separately before running the `exports.sh` lines.

```
cd cdk && npm run build && cdk synth && cdk deploy &> ../cdkdeployresult.txt
cd .. && node parseResults.js cdkdeployresult.txt
```

# Troubleshooting

## CDK Deploy not working

1. Visit https://console.aws.amazon.com/cloudformation/home to see why a deployment is failing
1. If you're not in production yet, `cdk destroy` and then follow the `To edit the AWS Stack` instructions. This will blow away your stack and build it again. Some changes 
