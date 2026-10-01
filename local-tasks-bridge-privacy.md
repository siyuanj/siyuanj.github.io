---
layout: homepage
title: Local Tasks Bridge Privacy Policy
permalink: /local-tasks-bridge/privacy/
---

Last updated: October 1, 2026

## Data the app accesses

Local Tasks Bridge accesses the Google account identity selected during OAuth,
Google Tasks lists and tasks, and the Apple Reminders list selected in the
local configuration. Task data may include titles, notes, due dates, completion
status, list membership, and service identifiers needed to match items.

## How data is used

The app uses this data only to synchronize the selected Apple Reminders and
Google Tasks lists, detect conflicts, verify synchronization results, and show
local diagnostic status. It does not use task data for advertising, profiling,
or model training.

The app's use and transfer of information received from Google APIs adheres to
the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy),
including its Limited Use requirements.

## Storage and sharing

OAuth credentials, synchronization state, item mappings, and diagnostic logs
are stored locally on the user's Mac. The app communicates directly with
Google's official OAuth and Tasks API endpoints and Apple's local EventKit
framework. It does not send task content or OAuth tokens to an app-developer
server and does not sell or share Google user data with third parties.

The Mac's operating system, iCloud, Google, and GitHub Pages process data under
their own policies when their respective services are used. This public policy
page contains no task content, OAuth credentials, or synchronization logs.

## Retention and deletion

Local credentials, state, and logs remain on the Mac until the user removes
them. The user can stop the local background process, delete its local data,
and revoke Google access at any time from the Google Account security settings.
Deleting local bridge data does not itself delete tasks stored by Google or
Apple.

## Security

The app uses Google's OAuth authorization flow, a loopback redirect, PKCE, and
state validation. Access is limited to the scopes shown on the Google consent
screen. No method of storage or transmission can be guaranteed completely
secure.

## Changes and contact

This policy will be updated on this page if the app's data practices change.
For privacy questions, use the support address displayed on the Google OAuth
consent screen.

[Return to the Local Tasks Bridge page](/local-tasks-bridge/).
