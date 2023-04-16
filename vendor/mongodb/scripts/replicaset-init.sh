#!/bin/bash

mongo <<EOF
var config = {
    "_id": "rs0",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "host.docker.internal:27017",
            // "host": "192.168.1.80:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "host.docker.internal:27018",
            // "host": "192.168.1.80:27018",
            "priority": 0
        },
        {
            "_id": 3,
            "host": "host.docker.internal:27019",
            // "host": "192.168.1.80:27019",
            "priority": 0
        }
    ]
};
rs.initiate(config, { force: true });
//rs.reconfig(cfg, { force: true });
rs.status();
EOF


DELAY=25
echo ""
echo "****** Waiting for ${DELAY} seconds for replicaset configuration to be applied ******"
sleep $DELAY

mongo <<EOF
use admin;
admin = db.getSiblingDB('admin');
admin.createUser({ user: 'root', pwd: 't5t4ZpOOeW1JfPDp', roles: [{ role: 'root', db: 'admin' }] });
db.getSiblingDB('admin').auth('root', 't5t4ZpOOeW1JfPDp');
rs.status();
EOF