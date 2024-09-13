# Running the Python back-end in host mode

When developing an application, it is often important to easily test and debug it.

To start the application, execute the following command from the project's root directory:

```shell
cartesi run --no-backend
```

This DApp's back-end is written in Python, so to run it in your machine you need to have python3 installed. The backend uses hsapely library, so you should install libgeos-c on your host (refer to geos).

Then in order to start the back-end, run the following commands in a dedicated terminal:

```shell

python3 ./sqlite.py

cd dapp
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
ROLLUP_HTTP_SERVER_URL="http://localhost:8080/host-runner" python3 drawing.py
```

The final command will effectively run the back-end and send corresponding outputs to port 5004. It can optionally be configured in an IDE to allow interactive debugging using features like breakpoints. You can also use a tool like entr to restart the back-end automatically when the code changes. For example:

ls \*.py | ROLLUP_HTTP_SERVER_URL="http://localhost:8080/host-runner" entr -r python3 drawing.py

After the back-end successfully starts, it should print an output like the following:

INFO:**main**:HTTP rollup_server url is http://localhost:8080/host-runner
INFO:**main**:Sending finish

After that, you can interact with the application normally as explained in the README.md in the project's root directory.

Keep in mind that vouchers cannot be executed when the dApp is running in a development mode.
