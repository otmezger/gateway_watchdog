from config import config
C=config()

from parse_rest.connection import register
register(C['APPLICATION_ID'], C['REST_API_KEY'])

from parse_rest.datatypes import Object
class GatewayIP(Object):
    pass
class Gateway(Object):
    pass

import urllib2
import socket
import fcntl
import struct



def getExtIP():
    try:
        response = urllib2.urlopen('http://dynupdate.no-ip.com/ip.php')
        return response.read()
    except:
        return false


def get_ip_address(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    return socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,  # SIOCGIFADDR
        struct.pack('256s', ifname[:15])
    )[20:24])


actualExtIP = getExtIP()
actualIntIP = get_ip_address('eth0')

gatewayIP = GatewayIP()

doSave = False
if actualExtIP:
    gatewayIP.IP_ext = actualExtIP
    doSave = True
if actualIntIP:
    gatewayIP.IP_int = actualIntIP
    doSave = True

if doSave:
    gateway = Gateway()
    gateway.objectId = C['GATEWAY_PARSE_ID']
    gatewayIP.Gateway = gateway
    gatewayIP.save()
