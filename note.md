---
layout: homepage
title: Notes
permalink: /note/
---

## <span>Notes</span>

<div class="post-list">
  {% assign notes = site.notes | sort: "date" | reverse %}
  
  {% for note in notes %}
    
    {% if note.title %}
      {% assign display_title = note.title %}
    {% else %}
      {% assign display_title = note.content | split: "
" | first | remove: "#" | strip %}
    {% endif %}

    <div class="post-item">
      <span class="post-date" style="opacity: 0.5;">NOTE</span>
      
      <a class="post-link" href="{{ note.url | relative_url }}">
        {{ display_title }}
      </a>
    </div>
    
  {% endfor %}
</div>

{% if site.notes.size == 0 %}
<p>No notes yet.</p>
{% endif %}