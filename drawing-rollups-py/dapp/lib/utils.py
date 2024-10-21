import zlib 

##
# Helper Functions 

def str2hex(string):
    """
    Encode a string as a hex string
    """
    return binary2hex(str2binary(string))

def str2binary(string):
    """
    Encode a string as a binary string
    """
    return string.encode("utf-8")

def binary2hex(binary):
    """
    Encode a binary as a hex string
    """
    return "0x" + binary.hex()


def hex2binary(hexstr):
    """
    Decodes a hex string into a regular byte string
    """
    return bytes.fromhex(hexstr[2:])

def hex2str(hexstr):
    """
    Decodes a hex string into a regular string
    """
    print(hexstr)
    return hex2binary(hexstr).decode("utf-8", errors='ignore')
    # return hex2binary(hexstr).decode("utf-8")

def decompress(hexstr): 
    """
    Decodes a hex string into a bytearray
    The bytearray is compressed data
    """
    bytearray_data = bytearray.fromhex(hexstr[2:])
    decompressed = zlib.decompress(bytearray_data)

    return decompressed

def clean_header(mint_header):
    if mint_header[:2] == "0x":
        mint_header = mint_header[2:]
    mint_header = bytes.fromhex(mint_header)
    return mint_header
