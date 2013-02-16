<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
option explicit
response.charset = "UTF-8"
server.scripttimeout = 9999
%>
<!--#include file="md5.asp"-->
<%
'===============================================
'函 数 名：Format_Time(s_Time)
'函数用途：API时间格式化函数
'版权所有：我要溜溜吧
'===============================================
Function Format_Time(s_Time)
    Dim y, m, d, h, mi, s
    Format_Time = ""
    If IsDate(s_Time) = False Then Exit Function
    y = cstr(year(s_Time))
    m = cstr(month(s_Time))
    If len(m) = 1 Then m = "0" & m
    d = cstr(day(s_Time))
    If len(d) = 1 Then d = "0" & d
    h = cstr(hour(s_Time))
    If len(h) = 1 Then h = "0" & h
    mi = cstr(minute(s_Time))
    If len(mi) = 1 Then mi = "0" & mi
    s = cstr(second(s_Time))
    If len(s) = 1 Then s = "0" & s
    Format_Time = y & "-" & m & "-" & d & " " & h & ":" & mi & ":" & s
End Function
'===============================================
'函 数 名：httpGet(url,data)
'函数用途：API获取数据函数
'版权所有：我要溜溜吧
'===============================================
Function httpGet(url,data)
    Dim xmlhttp
    Set xmlhttp = Server.CreateObject("MSXML2.ServerXMLHTTP")
    xmlhttp.open "GET", url + "?" + data, False
    xmlhttp.setRequestHeader "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"
    xmlhttp.setRequestHeader "Content-Length", Len(data)
    xmlhttp.send (Null)
    If (xmlhttp.Status = 200) Then 
   	httpGet = xmlhttp.responseText
else
   exit function
end if
    Set xmlhttp = Nothing
End Function
%>
<%
'================================================================
dim conf_appKey,conf_appSecret,conf_pid
dim conf_postUrl,conf_format,conf_signMethod,conf_v
conf_appKey = "21338611"
conf_appSecret = "6040ad893811377ff35a8589c4ed557b"
conf_pid = "11988958"
conf_postUrl = "http://gw.api.taobao.com/router/rest"
conf_format = "json"
conf_signMethod = "md5"
conf_v = "2.0"
dim p_timestamp,p_method,p_fields
p_timestamp = Format_Time(Now())
p_method = "taobao.taobaoke.items.detail.get"
p_fields = "click_url,title,pic_url"
function CreateData(num_iid)
	dim sign,appData
	sign = UCase(MD5(conf_appSecret&"api_key"&conf_appKey&"fields"&p_fields&"format"&conf_format&"method"&p_method&"num_iids"&num_iid&"pid"&conf_pid&"sign_method"&conf_signMethod&"timestamp"&p_timestamp&"v"&conf_v&""&conf_appSecret))
	appData = "api_key="&conf_appKey&"&fields="&p_fields&"&format="&conf_format&"&method="&p_method&"&pid="&conf_pid&"&num_iids="&num_iid&"&sign_method="&conf_signMethod&"&timestamp="&server.URLEncode(p_timestamp)&"&v="&conf_v&"&sign="&sign
	CreateData = appData
end function
dim g_num_iid,g_params,g_jsonp
dim content_text, content_jsonp
g_num_iid = request.queryString("id")
g_jsonp = request.queryString("jsonp")
if g_num_iid<>"" Then
	g_params = CreateData(g_num_iid)
	content_text = httpGet(conf_postUrl, g_params)
	if(g_jsonp<>"") then
		content_jsonp = (g_jsonp&"("&content_text&")")
    else
        content_jsonp = content_text
	end if
    response.write content_jsonp
end if
%>