FROM docker.elastic.co/elasticsearch/elasticsearch:9.3.4

USER root

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
COPY ./setup-ilm.sh /usr/local/bin/setup-ilm.sh

RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/setup-ilm.sh

USER elasticsearch

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]