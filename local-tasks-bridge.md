---
layout: homepage
title: Local Tasks Bridge
permalink: /local-tasks-bridge/
---

## About the app

Local Tasks Bridge is a personal macOS utility that synchronizes one selected
Apple Reminders list with Google Tasks. It lets the Mac Reminders widget show
tasks created in Google Tasks, including tasks created through Gemini, and
keeps supported changes synchronized in both directions.

The app runs locally on the signed-in Mac. It connects directly to Apple's
EventKit framework and Google's official OAuth and Tasks APIs. It does not use
an app-developer server to relay task content.

## Google access

The app requests permission to view and manage Google Tasks, plus the basic
Google identity scopes needed to identify the signed-in account. It does not
request access to Google Calendar, Google Drive, Gmail, or Google Cloud data.

Google Tasks permission applies to the signed-in account. The app's local
configuration selects which named Reminders and Tasks list is synchronized.

Read the [privacy policy](/local-tasks-bridge/privacy/) for details about local
storage, data use, retention, and revoking access.

## Support

This app is maintained for personal use. For questions about Google consent or
data handling, use the support address displayed on the Google OAuth consent
screen.

