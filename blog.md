---
layout: homepage
title: Blog
permalink: /blog/
---

## <span>Blog Posts</span>

<div class="post-list">
  {% comment %}Chinese versions are reached from their English post, so they are not listed again here.{% endcomment %}
  {% assign blogs = site.blogs | where_exp: "post", "post.lang != 'zh'" | sort: "date" | reverse %}
  
  {% for post in blogs %}
  <div class="post-item">
    <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
    
    <a class="post-link" href="{{ post.url | relative_url }}">
      {{ post.title }}
    </a>
    {% if post.translation_key %}
      {% assign zh = site.blogs | where: "translation_key", post.translation_key | where: "lang", "zh" | first %}
      {% if zh %}<a class="post-lang-link" href="{{ zh.url | relative_url }}" lang="zh" hreflang="zh">中文</a>{% endif %}
    {% endif %}
  </div>
  {% endfor %}
</div>

{% if site.blogs.size == 0 %}
<p>No blog posts yet.</p>
{% endif %}