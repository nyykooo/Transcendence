FROM docker.elastic.co/kibana/kibana:9.3.4

COPY import-dashboard.sh /usr/local/bin/import-dashboard.sh

USER root
RUN chmod +x /usr/local/bin/import-dashboard.sh
USER kibana

CMD ["/bin/bash", "-c", "\
/usr/local/bin/kibana-docker & \
sleep 30 && \
/usr/local/bin/import-dashboard.sh && \
wait"]