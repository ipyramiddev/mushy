# Onboarding process

Once a creator fills in the Onboarding form, a ticket is automatically added on
this board - https://app.asana.com/0/1200950523365288/board. 
Once it is verified, it will get into the Ready for Integration column to be picked
up for onboarding.

## Pre-requisites

There are some pre-requisites before this change is required in the UI.
1. Access to `digitaleyes` repo - https://github.com/the-robot-factory/digitaleyes
2. Access to `offer-indexer` repo - https://github.com/the-robot-factory/offer-indexer
3. DE Google account - name@digitaleyes.market 
4. Permissions to Datastore
5. Access to this board - https://app.asana.com/0/1200950523365288/board 
6. Read the README.md in `offer-indexer/gcp_scripts/README.md` (There are some more pre-requisites in there)

## Steps in digitaleyes repo

### Step 1
Copy the image for the new collection in `public/assets/thumbnails`.

If there is an existing collection, and you just want to update the image, replace the existing image
with the new one.

### Step 2
Commit your changes and submit a PR to master.
After the changes are verified and merged, they will reflect on the website in around 2-4 minutes.

### Step 3 - Most important
Clone the `offer-indexer` repo and follow the steps in `gcp_scripts/guides/how-to-create-update-delete-collection.md` 
to proceed with the onboarding process.
