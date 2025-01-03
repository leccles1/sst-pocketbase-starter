## Pocketbase Cloud host testing
Testing Hosting [Pocketbase](https://pocketbase.io/) across cloud providers in a "serverless" way. 

Both ways require a pocketbase container. see `./Dockerfile`

Pocketbase initialised as an "extended" instance (Not using a straight up built binary)
* AWS - Fargate
* Google - CloudRun

### Deploying

Uses stage name to determine which cloud provider to use. Currently supports aws and google cloud.

```bash
sst deploy --stage <gcp | aws>
```

Will throw an error if one of the supported providers aren't used for the stage.



