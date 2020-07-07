function hook_wechat(){
    Java.perform(function(){
        v2protocal.videoEncodeToLocal.implementation=function(bArr, i,  i2,  i3,  i4,  i5,  i6,  iArr){
            console.log(bArr, i,  i2,  i3,  i4,  i5,  i6,  iArr)
            var result=this.videoEncodeToLocal(bArr, i,  i2,  i3,  i4,  i5,  i6,  iArr)
            return result
        }
        v2protocal.videoEncodeToSend.implementation=function(bArr,  i,  i2,  i3,  i4){
            console.log(bArr,  i,  i2,  i3,  i4)
            var result=this.videoEncodeToSend(bArr,  i,  i2,  i3,  i4)
            return result
        }
    })
    var base_voipMain=Module.findBaseAddress("libvoipMain.so")
    Interceptor.attach(base_voipMain.add(0x00037DE4),{
        onEnter:function(args){
            console.log(args[0],args[1],args[2],ptr(args[3]).readCString(),args[4],ptr(args[5]).readCString(),args[6])
        }
    })
    var sendto=Module.findExportByName("libc.so","sendto")
    Interceptor.attach(sendto,{
        onEnter:function(args){
            console.log(Thread.backtrace(this.context,Backtracer.ACCURATE).map(DebugSymbol.fromAddress))
        }
    })
    var getifaddrs=Module.findExportByName("libvoipComm.so","_Z10getifaddrsPP7ifaddrs")
    Interceptor.attach(getifaddrs,{
        onEnter:function(args){
            console.log(args[0],hexdump(args[0]),args[0].readPointer(),hexdump(args[0].readPointer()))
        },onLeave:function(retval){
            console.log(retval)
        }
    })
    var MMTSockSendto=Module.findExportByName("libvoipComm.so","_ZN9MMTinyLib13MMTSockSendtoEiPKvljPKNS_20mmt_sockaddr_storageEPNSt6__ndk13mapIS2_S2_NS5_4lessIS2_EENS5_9allocatorINS5_4pairIS3_S2_EEEEEEi")
    var MMTSockRecvfrom=Module.findExportByName("libvoipComm.so","_ZN9MMTinyLib15MMTSockRecvfromEiPvPijPNS_20mmt_sockaddr_storageE")
    var MMTSockSend=Module.findExportByName("libvoipComm.so","_ZN9MMTinyLib11MMTSockSendEiPKvPlj")
    var MMTSockRecv=Module.findExportByName("libvoipComm.so","_ZN9MMTinyLib11MMTSockRecvEiPvPij")
    Interceptor.attach(MMTSockSendto,{
        onEnter:function(args){
            console.log(hexdump(args[1],{length:parseInt(args[2])}))
        }
    })
    Interceptor.attach(MMTSockRecvfrom,{
        onEnter:function(args){
            this.arg1=args[1]
            this.arg2=args[2]
        },onLeave:function(retval){
            console.log(hexdump(this.arg1,{length:ptr(this.arg2).readUInt()}))
        }
    })
    var getChannelReport=Module.findExportByName("libvoipMain.so","Java_com_tencent_mm_plugin_voip_model_v2protocal_getChannelReport")
    Interceptor.attach(getChannelReport,{
        onEnter:function(args){
            this.arg2=args[2]
            this.arg3=args[3]
            console.log(hexdump(args[2],{length:parseInt(args[3])}))
        },onLeave:function(retval){
            console.log(hexdump(this.arg2,{length:parseInt(this.arg3)}))
        }
    })
    var getChannelReport=Module.findExportByName("libvoipMain.so","getChannelReport")
    Interceptor.attach(getChannelReport,{
        onEnter:function(args){
            this.arg0=args[0]
            this.arg1=args[1]
            this.arg2=args[2]
            console.log(hexdump(args[2],{length:parseInt(args[3])}),hexdump(this.arg0),this.arg1,this.arg2)
        },onLeave:function(retval){
            console.log(hexdump(this.arg0),this.arg1,this.arg2)
        }
    })
    var getMPDirectReport=Module.findExportByName("libvoipMain.so","getMPDirectReport")
    Interceptor.attach(getMPDirectReport,{
        onEnter:function(args){
            this.arg0=args[0]
            console.log(hexdump(args[2],{length:parseInt(args[3])}))
        },onLeave:function(retval){
            console.log(hexdump(this.arg0.readPointer()),this.arg0,hexdump(retval,{length:parseInt(0x1000)}))
        }
    })
    var getMPDirectReport= Module.findExportByName("libvoipMain.so","Java_com_tencent_mm_plugin_voip_model_v2protocal_getMPDirectReport")
    Interceptor.attach(getMPDirectReport,{
        onEnter:function(args){
            this.arg0=args[0]
            this.x0=this.context.x0
            this.x26=this.context.x26
            this.x25=this.context.x25
            this.x24=this.context.x24
            this.x23=this.context.x23
            this.x21=this.context.x21
            this.x22=this.context.x22
            this.x20=this.context.x20
            this.x19=this.context.x19
            this.x30=this.context.x30
            console.log(args[0],hexdump(args[2],{length:parseInt(args[3])}))
        },onLeave:function(retval){
            console.log(hexdump(this.arg0.readPointer()),hexdump(this.arg0.readPointer(),{length:parseInt(retval)}),this.x19,this.x20,this.x21,this.x22,this.x23,this.x24,this.x25,this.x26,this.x30,hexdump(this.x0))
        }
    })
}

function main() {
    hook_wechat();
}

setImmediate(main);