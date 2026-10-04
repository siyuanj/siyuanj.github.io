<ul class="publication-cards">
  {% for publication in site.data.publications.main %}
  <li class="publication-card">
    <div class="publication-visual">
      <span class="publication-conference-badge">{{ publication.conference_short | escape }}</span>
      {% if publication.image %}
      <a class="publication-image-link" href="{{ publication.image | relative_url }}" aria-label="View {{ publication.short_title | escape }} framework figure">
        <img class="publication-teaser" src="{{ publication.image | relative_url }}" alt="{{ publication.image_alt | default: publication.title | escape }}" width="{{ publication.image_width }}" height="{{ publication.image_height }}" loading="lazy" decoding="async">
      </a>
      {% endif %}
    </div>
    <div class="publication-details">
      <h3 class="publication-title">
        {% if publication.pdf %}<a href="{{ publication.pdf | relative_url }}">{{ publication.title | escape }}</a>{% else %}{{ publication.title | escape }}{% endif %}
      </h3>
      <div class="publication-authors">{{ publication.authors | markdownify }}</div>
      <p class="publication-venue"><abbr title="{{ publication.conference | escape }}">{{ publication.conference_short | escape }} {{ publication.year }}</abbr><span class="publication-status">{{ publication.status | escape }}</span></p>
      <div class="publication-links">
        {% if publication.arxiv %}<a class="publication-link" href="{{ publication.arxiv }}">arXiv</a>{% endif %}
        {% if publication.pdf %}<a class="publication-link" href="{{ publication.pdf | relative_url }}">PDF</a>{% endif %}
        {% if publication.code %}<a class="publication-link" href="{{ publication.code }}">Code</a>{% endif %}
        {% if publication.page %}<a class="publication-link" href="{{ publication.page }}">Project Page</a>{% endif %}
        {% if publication.bibtex %}<a class="publication-link" href="{{ publication.bibtex | relative_url }}" download>BibTeX</a>{% endif %}
      </div>
    </div>
  </li>
  {% endfor %}
</ul>
