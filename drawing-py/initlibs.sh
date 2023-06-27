#!/bin/sh
# Copyright 2022 Cartesi Pte. Ltd.
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.


###
# Prepare enviroment to import Geos libs

# Rename (by linking)
echo '( ln -s $1 $(echo $1 | sed "s/\(.*\/lib\/\)\(lib.*.so\).*/\1\2/") ) || true;' > linklib.sh
find /mnt/dapp/3rdparty/geos -name "lib*.so*" -type f -exec sh linklib.sh {} \;

# add libc fallbacks
sed -i "s/load_dll('c')/load_dll('c',fallbacks=['libc.so','libc.so.6'])/" /mnt/dapp/.crossenv/cross/lib/python3.10/site-packages/shapely/geos.py



###
# Prepare enviroment to import Opencv libs

# Rename cv2 lib
echo '( mv $1 $(echo $1 | sed "s/\(.*cv2\).*\(\.so\)/\1\2/") ) || true;' > mvcv2lib.sh 
find /mnt/dapp/3rdparty/opencv/lib/ -name cv2*.so -type f -exec sh mvcv2lib.sh {} \;

# point to correct absolute path
sed -i "s/\.\.\/\.\.\/\.\.\/\.\.\//\/mnt\/dapp\/3rdparty\/opencv\//" $(grep -rl "../../../../" /mnt/dapp/3rdparty/opencv/lib/python* )

# move cv2 lib to python packages dir
rm -rf /mnt/dapp/.crossenv/cross/lib/python3.10/site-packages/cv2
mv $(find /mnt/dapp/3rdparty/opencv/lib/ -name cv2) /mnt/dapp/.crossenv/cross/lib/python3.10/site-packages/.

# Rename (by linking) 
echo '( ln -s $1 $(echo $1 | sed "s/\(.*.so\).*/\1.406/") ) || true;' > linkopencvlib.sh
# echo '( ln -s $1 $(echo $1 | sed "s/\(.*.so\)\(\.[[:digit:]]\+\)\.\([[:digit:]]\+\)\.\([[:digit:]]\+\)/\1\2\3\4/") ) || true;' > linkopencvlib.sh
find /mnt/dapp/3rdparty/opencv/ -name "lib*.so*" -type f -exec sh linkopencvlib.sh {} \;
