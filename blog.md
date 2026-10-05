---
layout: homepage
title: Blog
permalink: /blog/
---

## <span>Blog Posts</span>

{% comment %}Chinese versions are reached from their English post, so they are not listed again here.{% endcomment %}
{% comment %}Filenames start with the date; sorting by path keeps same-day posts in a stable order shared with previous/next links.{% endcomment %}
{% assign blogs = site.blogs | where_exp: "post", "post.lang != 'zh'" | sort: "path" | reverse %}
{% assign years = blogs | group_by_exp: "post", "post.date | date: '%Y'" %}
<div class="post-list post-list-grouped">
  {% for year in years %}
  <h3 class="post-year">{{ year.name }}</h3>
  {% for post in year.items %}
  <div class="post-item">
    <time class="post-date" datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: "%m-%d" }}</time>
    <div class="post-summary">
      <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
      {% if post.description %}<p class="post-description">{{ post.description | strip_html | escape }}</p>{% endif %}
    </div>
    {% if post.translation_key %}
      {% assign zh = site.blogs | where: "translation_key", post.translation_key | where: "lang", "zh" | first %}
      {% if zh %}<a class="post-lang-link" href="{{ zh.url | relative_url }}" lang="zh" hreflang="zh">中文</a>{% endif %}
    {% endif %}
  </div>
  {% endfor %}
  {% endfor %}
</div>

{% if site.blogs.size == 0 %}
<p>No blog posts yet.</p>
{% endif %}
