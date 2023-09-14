group "default" {
  targets = ["server", "console"]
}
target "local-deployments" {
  context = "./docker"
  target = "local-deployments-stage"
}

target "deployments" {
  context = "./docker"
  target = "deployments-stage"
}
target "wrapped" {
  context = "./docker"
  target = "wrapped-stage"
  contexts = {
    dapp = "target:dapp"
  }
}

target "fs" {
  context = "./docker"
  target  = "fs-stage"
  contexts = {
    wrapped = "target:wrapped"
    deployments = "target:deployments"
    local-deployments = "target:local-deployments"
  }
}

target "server" {
  context = "./docker"
  target  = "server-stage"
  contexts = {
    fs = "target:fs"
  }
}

target "console" {
  context = "./docker"
  target  = "console-stage"
  contexts = {
    fs = "target:fs"
  }
}

target "machine" {
  context = "./docker"
  target  = "machine-stage"
  contexts = {
    fs = "target:fs"
  }
}