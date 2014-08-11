#!/bin/bash
#
# Copy 'build' to the location http://apps.kivuto.com/schoolfinder/build
#

echo "Copy 'build' to the location http://apps.kivuto.com/schoolfinder/build"
scp -r  build/* root@kivuto.com:/var/www/vhosts/onthehub.com/apps.onthehub.com/schoolfinder/