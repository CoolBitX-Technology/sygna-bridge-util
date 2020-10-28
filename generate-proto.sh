#!/bin/bash

set -e -o pipefail

# run in project root
PROTO_PATH="./src/netki/proto"
OUT_DIR="./src/netki/proto/generated"

mkdir -p $OUT_DIR

for PROTO_F in $(find $PROTO_PATH -name '*.proto')
do
    echo "Generating $PROTO_F"
    # Generate node code.
    npx grpc_tools_node_protoc \
        --js_out=import_style=commonjs,binary:$OUT_DIR \
        --grpc_out=generate_package_definition:$OUT_DIR \
        -I $PROTO_PATH \
        -I /usr/include \
        $PROTO_F

    # Generate node typescript declaration files.
    npx protoc \
        --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
        --ts_out=generate_package_definition:$OUT_DIR \
        -I $PROTO_PATH \
        -I /usr/include \
        $PROTO_F
done