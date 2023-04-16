#!/bin/bash

mongo <<EOF
print('Login success: ' + (db.getSiblingDB("admin").auth("root", "t5t4ZpOOeW1JfPDp") === 1));
EOF