{% for publication in site.data.publications.main %}
**{{ publication.title }}**<br>
{{ publication.authors }}.<br>
*{{ publication.conference }}*. {{ publication.status }}.
{% endfor %}
