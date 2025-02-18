# HGF helper

## Overview
This is a small extension for the Chrome browser that allows you to play mini-games on the .tv/hitsquadgodfather channel in semi-afk mode. It consists of two parts.

### Twitch helper

Overlay update that the extension works with: **Feb 18, 2025**

A widget is placed on the stream page that allows you to play mini-games in semi-automatic mode. The main functions of the widget are
1. automatically sends the `!hitsquad` command to the chat if the corresponding checkbox is enabled;
1. adds a button to easily send the `!hitsquad` command in manual mode;
2. automatically generates a question for Akira's drawing if the corresponding checkbox is checked;
1. adds a button to easily participate in the Akira's drawing;
1. automatically detect the anti-cheat screen and block the sending of commands. Scheduled commands will be sent automatically after the anti-cheat has finished;
1. automatically removes the delay on the stream once a minute;
1. automatically collects channel points;
1. automatically refresh the stream page if there are problems with the video;
1. all features continue to work while showing ads;

The appearance of the widget is shown in the image below:

![readme_1.png](./readme_1.png)

### StreamElements helper
The widget mounts on the store page and adds several useful features:
1. automatically sorts offers by cost when you enter the page;
1. adds a button to the offers that allows you to hide the offer (the game has already been purchased, or you already own the game);
1. adds a link to the game's Steam page;
1. adds the ability to hide offers above a certain price (from the extension popup);
1. highlight offers with less than 10 items left (red border around)

The appearance of the widget is shown in the image below:

![readme_2.png](./readme_2.png)

Important information: Some customization is required for the widget to be available (see **Installation** for details).

## Installation
1. Download the latest release (hgf-helper<area>@v1.x.y.zip) from the [releases page](https://github.com/v3il/hgf-helper/releases);
2. Unzip the archive to any directory;
3. Go to the extensions page in the Chrome browser (chrome://extensions/);
4. Turn on developer mode;
5. Click the "**Download unpacked extension**" button, specifying the path to the unpacked extension.
6. **[optional]** Open the extension pop-up window, enter your [JSONBin](https://jsonbin.io/) account credentials for the StreamElements widget to work (these credentials will not be shared)

## Update
1. Download the latest release (hgf-helper<area>@v1.x.y.zip) from the [releases page] (https://github.com/v3il/hgf-helper/releases);
2. Extract the archive to any directory;
3. Copy all the files of the new version of the extension into the directory of the old version, confirming the replacement of the files;
4. On the extensions page (chrome://extensions/), click the "Update extensions" button.

## Disclaimer
**The extension may stop working properly at any time. The author of the extension does not recommend leaving the stream unattended for long periods of time and is not responsible for any strikes received.**
