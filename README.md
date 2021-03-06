# README

## [DERP-App](https://derp-game-app.herokuapp.com/)

DERP-App is the official character creator and mobile game manager for the proprietary DERP System Tabletop Roleplaying Games.

The DERP System launches with GED: Guild of Expendable Dungeoneers, a game of dangerous idiots on fantastical adventures. Players take on the role of the titular expendable adventurers in the also-titular guild, skilled dungeon-delvers each hampered by a tragicomic flaw. Guided by a Director who describes the world around them and acts as referee, they dive into hazardous dungeons where the only thing more perilous than the traps and monsters is themselves.

<figure>
  <img src="https://i.imgur.com/GqWde8q.png">
  <figcaption><em>Main page for GED: the launch game for the DERP System</em></figcaption>
</figure>
<br/>

DERP-App provides tools for Directors to create their own campaigns and invite new players. The App keeps track of each player's stable of characters, both active and deceased. Users can also request to join new campaigns and create new characters for them or assign free characters.

<figure>
  <img src="https://i.imgur.com/wTRTQmx.png">
  <figcaption><em>Campaign page (desktop)</em></figcaption>
</figure>
<br/>

<figure>
  <img src="https://i.imgur.com/YCFr5sm.png">
  <figcaption><em>Campaign page (mobile)</em></figcaption>
</figure>
<br/>

The app has a responsive design that makes it easy to use on both desktop and mobile. Prepare for a game beforehand on desktop and have all your campaigns and characters ready on your phone at the table. No need for printing character sheets and the built-in dice roller means never having to worry about forgetting your little plastic rolly bits at home.

<figure>
  <img src="https://i.imgur.com/BDU16Mc.png">
  <figcaption><em>Check requests to join campaigns from the navbar</em></figcaption>
</figure>
<br/>

Character creation is quick and easy. Just follow the listed steps one-by-one, provide a name, and click Generate Character and your new adventurer will be added to the roster of any of your current campaigns (or to a general stock of unassigned characters that you can later migrate to other campaigns).

<figure>
  <img src="https://i.imgur.com/NER9ZTw.png">
  <figcaption><em>Final confirmation at the end of character creation</em></figcaption>
</figure>
<br/>

Once created, you can access your digital character sheet conveniently from mobile, using the navbar links at the top to get directly to whatever information you need.

<figure>
  <img src="https://i.imgur.com/Fh8CPZq.png">
  <figcaption><em>Character page (desktop)</em></figcaption>
</figure>
<br/>

<figure>
  <img src="https://i.imgur.com/m344NiL.png">
  <figcaption><em>Character page (mobile)</em></figcaption>
</figure>
<br/>

To avoid excessive data usage, the app uses localStorage to persist a copy of any changes made to the character in realtime even if the user refreshes or navigates away from the page, their mobile device enters sleep mode, or even if they open another character. Saving the character sends a new request to the backend, saving the changes in the backend and clearing the localStorage copy.

<figure>
  <img src="https://i.imgur.com/0FAysEV.png">
  <figcaption><em>Each character class has their own unique abilities (desktop)</em></figcaption>
</figure>
<br/>

<figure>
  <img src="https://i.imgur.com/TKLEP4y.png">
  <figcaption><em>Manage every aspect of your character from your mobile device</em></figcaption>
</figure>

## Technology Used

DERP-App has a backend built in Rails6, the newest version of the Ruby-on-Rails framework utilizing the webpacker gem for Javascript packaging. The frontend is built on React with customized statehandling that feeds data directly to components through callbacks passed to Ajax API calls, obviating the need for a state container like Redux. The UI components utilize Bootstrap as a base, but with multiple customized classes to provide a consistent aesthetic. Hosting provided by Heroku.

<figure>
  <img src="https://i.imgur.com/Vw1KycT.png">
  <figcaption><em>Customized Bootstrap classes for consistent aesthetic</em></figcaption>
</figure>
<br/>

<figure>
  <img src="https://i.imgur.com/EaZVffa.png">
  <figcaption><em>Polymorphic associations allow DRY code for invites to/from campaigns and users</em></figcaption>
</figure>
<br/>

<figure>
  <img src="https://i.imgur.com/1LCkznE.png">
  <figcaption><em>Language logic used for proper presentation of modular text components</em></figcaption>
</figure>

## Coming Features

* Social Features - Invite other users to be friends and see their personalized profiles
* Campaign Management Options - Set campaign privacy, block invites at player limit, allow non-regulation characters
* Campaign Calendars - Create a calendar to schedule games, send the calendar out to players to confirm availability
* Director Tools - Quickly create randomized tables of magic items, stores, NPCs, and use push notifications to send real-time updates to players' characters
* Character Advancement - New and more in-depth options for leveling up characters
