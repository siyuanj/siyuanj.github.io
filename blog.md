---
layout: homepage
title: Blog
permalink: /blog/
---

## <span>Blog Posts</span>

<div class="post-list">
  {% assign blogs = site.blogs | sort: "date" | reverse %}
  
  {% for post in blogs %}
  <div class="post-item">
    <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
    
    <a class="post-link" href="{{ post.url | relative_url }}">
      {{ post.title }}
    </a>
  </div>
  {% endfor %}
</div>

{% if site.blogs.size == 0 %}
<p>No blog posts yet.</p>
{% endif %}