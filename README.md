## Pocketbase Cloud host testing

Testing Hosting [Pocketbase](https://pocketbase.io/) across cloud providers in a "serverless" way.

Both ways require a pocketbase container. see `./Dockerfile`

Pocketbase initialised as an "extended" instance (Not using a straight up built binary) but rather builds the executable based on the pocket `./server` project.

- AWS - Fargate
- Google - CloudRun

Initial investigation, Cloudrun is MUCH cheaper than Fargate, and additionally scales to 0 (No running instances). Fargate doesn't easily support scale to 0 functionality.

### Setup
Update placeholder values in sst config `sst.config.ts`

```
providers: {
    aws: {
      profile: "<enter_profile>",
      region: "eu-west-2",
    },
    gcp: {
      project: "<Enter gcp project id>",
    },
    docker: "4.5.8",
  },
```

### Deploying

Uses stage name to determine which cloud provider to use. Currently supports aws and google cloud.

```bash
sst deploy --stage <gcp | aws>
```

Will throw an error if one of the supported providers aren't used for the stage.
