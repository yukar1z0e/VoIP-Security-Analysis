function hook_telegram(){
    Java.perform(function(){
        var applicationContext=Java.use("android.content.Context")
        applicationContext.getSharedPreferences.overload('java.lang.String', 'int').implementation=function(name,mode){
            var ret=this.getSharedPreferences(name,mode)
            console.log(name,mode,ret)
            return ret
        }
        Java.choose("android.content.Context" , {
            onMatch : function(instance){
                console.log(instance);
            },
            onComplete:function(){}
        });
        var FileLog=Java.use("org.telegram.messenger.FileLog")
        FileLog.getNetworkLogPath.implementation=function(){
            var ret=this.getNetworkLogPath()
            console.log(ret)
            return ret
        }
        var ConnectionsManager=Java.use("org.telegram.tgnet.ConnectionsManager")
        ConnectionsManager.init.implementation=function(i, i2, i3, str, str2, str3, str4, str5, str6,  str7,  str8,  str9,  i4,  i5,  z){
            console.log(i, i2, i3, str, str2, str3, str4, str5, str6,  str7,  str8,  str9,  i4,  i5,  z)
        }
    })
    var sendto=Module.findExportByName("libc.so","sendto")
    Interceptor.attach(sendto,{
        onEnter:function(args){
            console.log(Thread.backtrace(this.context,Backtracer.ACCURATE).map(DebugSymbol.fromAddress))
        }
    })
    var base_tgvoip=Module.findBaseAddress("libtgvoip1.1loc.so")
    if(base_tgvoip){
        console.log(base_tgvoip)
        var IsEmpty=Module.findExportByName("libtgvoip1.1loc.so","_ZNK6tgvoip11IPv4Address7IsEmptyEv")
        console.log(IsEmpty)
        if(IsEmpty){
            Interceptor.attach(IsEmpty,{
                onEnter:function(args){
                    console.log(args[0],hexdump(args[0]),args[0].readPointer(),hexdump(args[0].readPointer()),args[0].readPointer().readPointer(),hexdump(args[0].readPointer().readPointer()))
                }
            })
        }
        var WriteBytes=Module.findExportByName("libtgvoip1.1loc.so","_ZN6tgvoip18BufferOutputStream10WriteBytesEPKhm")
        if(WriteBytes){
            Interceptor.attach(WriteBytes,{
                onEnter:function(args){
                    this.arg0=args[0]
                    this.arg1=args[1]
                    this.arg2=args[2]
                    console.log(hexdump(args[0]),hexdump(args[1]),args[2])
                },onLeave:function(retval){
                    console.log(hexdump(this.arg0),hexdump(this.arg1),this.arg2)
                }
            })
        }
        var printf=Module.findExportByName("libtgvoip1.1loc.so","_Z22tgvoip_log_file_printfcPKcz")
        if(printf){
            Interceptor.attach(printf,{
                onEnter:function(args){
                    console.log(args[0],args[1])
                }
            })
        }
        var SendUdpPing=Module.findExportByName("libtgvoip1.1loc.so","_ZN6tgvoip14VoIPController11SendUdpPingERNS_8EndpointE")
        if(SendUdpPing){
            Interceptor.attach(SendUdpPing,{
                onEnter:function(args){
                    console.log(args[0],args[1])
                }
            })
        }
    }
    var SendPacket=Module.findExportByName("libtgvoip1.1loc.so","_ZN6tgvoip14VoIPController10SendPacketEPhmRNS_8EndpointERNS0_21PendingOutgoingPacketE")
    if(SendPacket){
        Interceptor.attach(SendPacket,{
            onEnter:function(args){
                console.log(args[0],args[1],args[2],args[3])
            }
        })
    }
}
function main() {
    hook_telegram()
}
setImmediate(main);