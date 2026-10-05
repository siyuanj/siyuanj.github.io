---
layout: homepage
title: Notes
permalink: /note/
---

## <span>Notes</span>

<div class="post-list">
  {% assign notes = site.notes | sort: "date" | reverse %}
  {% comment %}Jekyll gives undated collection entries the build time as their date, so leave that date cell empty.{% endcomment %}
  {% assign build_time = site.time | date: "%s" %}
  {% for note in notes %}
  <div class="post-item">
    <span class="post-date">{% assign note_time = note.date | date: "%s" %}{% if note_time != build_time %}<time datetime="{{ note.date | date: '%Y-%m-%d' }}">{{ note.date | date: "%Y-%m-%d" }}</time>{% endif %}</span>
    <a class="post-link" href="{{ note.url | relative_url }}">{{ note.title | escape }}</a>
  </div>
  {% endfor %}
</div>

{% if site.notes.size == 0 %}
<p>No notes yet.</p>
{% endif %}
