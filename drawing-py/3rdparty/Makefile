
GEOS_VERSION := 3.11.0
OPENCV_VERSION := 4.6.0

.PHONY: clean

all: geos

geos:
	wget https://github.com/libgeos/geos/archive/refs/tags/${GEOS_VERSION}.tar.gz
	tar xvf ${GEOS_VERSION}.tar.gz
	rm ${GEOS_VERSION}.tar.gz
	cd geos-${GEOS_VERSION} && mkdir build && cd build && \
		cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${ROOT_DIR}/geos -DBUILD_SHARED_LIBS=ON -DCMAKE_TOOLCHAIN_FILE="/opt/riscv/rootfs/buildroot/work/host/share/buildroot/toolchainfile.cmake" ..
	cd geos-${GEOS_VERSION}/build && make -j14 && make install
	rm -rf geos-${GEOS_VERSION}

opencv: 
	wget https://github.com/opencv/opencv/archive/refs/tags/${OPENCV_VERSION}.tar.gz
	
	tar xvf ${OPENCV_VERSION}.tar.gz
	rm ${OPENCV_VERSION}.tar.gz
	# CXXFLAGS="-march=${ARCH} ${CXXFLAGS}" CFLAGS="-march=${ARCH} ${CFLAGS}" && \
	cd opencv-$(OPENCV_VERSION) && mkdir build && cd build && \
		cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=${ROOT_DIR}/opencv \
			-DBUILD_SHARED_LIBS=ON -DCMAKE_TOOLCHAIN_FILE="/opt/riscv/rootfs/buildroot/work/host/share/buildroot/toolchainfile.cmake" \
			-DPYTHON3_LIBRARIES=${PYTHON_DIR}/lib/libpython3.10.so \
			-DPYTHON3_LIBRARY=${PYTHON_DIR}/lib/python3.10/config-3.10-riscv64-linux-gnu/libpython3.10.a \
			-DPYTHON_INCLUDE_DIRS=${PYTHON_DIR}/include/python3.10/ \
			-DPYTHON3_INCLUDE_PATH=${PYTHON_DIR}/include/python3.10/ \
			-DPYTHON3_INCLUDE_DIR=${PYTHON_DIR}/include/python3.10/ \
			-DPYTHON3_NUMPY_INCLUDE_DIRS=${ROOT_DIR}/../.crossenv/cross/lib/python3.10/site-packages/numpy/core/include \
			-DPYTHON3_NUMPY_VERSION="1.23.4" \
			-DPYTHON_DEFAULT_EXECUTABLE=$(which python3) \
			-DBUILD_TESTS=OFF -DBUILD_PERF_TESTS=OFF -DBUILD_EXAMPLES=OFF \
			-DWITH_OPENCL=OFF -DBUILD_opencv_gpu=OFF -DBUILD_opencv_gpuarithm=OFF -DBUILD_opencv_gpubgsegm=OFF -DBUILD_opencv_gpucodec=OFF -DBUILD_opencv_gpufeatures2d=OFF \
			-DBUILD_opencv_gpufilters=OFF -DBUILD_opencv_gpuimgproc=OFF -DBUILD_opencv_gpulegacy=OFF -DBUILD_opencv_gpuoptflow=OFF -DBUILD_opencv_gpustereo=OFF \
			-DBUILD_opencv_gpuwarping=OF77F \
			..
	cd opencv-${OPENCV_VERSION}/build && make -j14 && make install
	# cd opencv-${OPENCV_VERSION}/build/python_loader && pip install .
	# cd opencv-${OPENCV_VERSION}/build/python_loader && python setup.py install
	rm -rf opencv-${OPENCV_VERSION}


# -DOPENCV_ENABLE_NONFREE=ON \
