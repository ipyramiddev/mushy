# How to update the "Featured of the day" section

## Pre-requisites

There are 3 pre-requisites before this change is required in the UI.
1. Access to this repo
2. Access to offer-indexer repo - https://github.com/the-robot-factory/offer-indexer 
3. You need a banner provided by the creator
4. Agree on a day for launching. There is a schedule for upcoming featured of the day candidates here - https://app.asana.com/0/1200950523365288/calendar


## Update "Featured of the day" for an existing collection

### Step 1
Copy the banner in the ```public/assets/collections``` folder.

### Step 2 
Go to ```src/views/home/index.tsx```.

Update the following lines with the name of your collection.
```
  const todaysCollectionSlug = "<COLLECTION_NAME>";
  const todaysCollectionName = "<COLLECTION_NAME>";
```
** Note: Make sure the name is the same as in the offer-indexer repo in `gcp_scripts/collections.json`.

### Step 3
In the same file, because you filled in the `todaysCollectionName` in the previous step,
in the first `<img>` tag including a banner, add the path to your banner.

```angular2html
<img
    src="/assets/collections/<BANNER_NAME>.png"
    alt={todaysCollection?.name}
    className="h-full w-full object-cover object-center opacity-40 absolute"
/>
```

I would recommend adjusting the opacity too depending on each banner.

### Step 4
Commit your changes and submit a PR to master.
After the changes are verified and merged, they will reflect on the website in around 2-4 minutes.

## Update "Featured of the day" for a non-existing (upcoming) collection

### Step 1
Copy the banner in the ```public/assets/collections``` folder.

### Step 2
Go to ```src/views/home/index.tsx```.

In the second `<img>` tag including a banner, add the path to your banner.

```angular2html
<img
  src="/assets/collections/<BANNER_NAME>.png"
  alt="Mad Trooper Banner"
  className="h-full w-full object-cover object-center absolute"
/>
```

In this section, you can also customise the links to other websites.

```angular2html
<div className="xl:max-w-7xl mx-4 sm:mx-6 xl:mx-auto border border-color-border shadow-md md:-mt-4 lg:-mt-16 p-5 relative bg-color-main-primary flex justify-center flex-wrap">
  <a
      href="<LINK TO WEBSITE>"
      target="_blank"
      rel="noreferrer"
      className="h-14 mb-4 lg:mb-0 flex items-center justify-center appearance-none disabled:opacity-50 duration-150 ease-in border border-color-border px-2 md:px-4 py-2 bg-almost-black text-xs sm:text-sm md:text-lg font-medium text-white text-center hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 uppercase md:mx-auto w-full sm:w-96"
  >
    SOME LINK TO Website
  </a>
  <a
      href="https://discord.com/invite/<DISCORD_ID>"
      target="_blank"
      rel="noreferrer"
      className="h-14 flex items-center justify-center appearance-none disabled:opacity-50 duration-150 ease-in border border-color-border px-2 md:px-4 py-2 bg-slateblue text-xs sm:text-sm md:text-lg font-medium text-white text-center hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 uppercase md:mx-auto w-full sm:w-96"
  >
    <DiscordLogo className="h-6 w-6 mr-2" />
    <span>SOME LINK TO Discord</span>
  </a>
</div>
```

### Step 3
Commit your changes and submit a PR to master.
After the changes are verified and merged, they will reflect on the website in around 2-4 minutes.
