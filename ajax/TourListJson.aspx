<%@ Page Language="C#" ContentType="text/html" ResponseEncoding="UTF-8" Debug="true" %>
<%
    /*Response.Write(@"{""ResponseStatus"":"
    +@"{""Ack"":""Success"",""Errors"":null,""Timestamp"":""1234567890""},"
    +@"""Data"":{
    +@"""DestinationCityName"":""上海"",""FilterLabelList"":{""Destination"":[{""Text"":""上海""},{""Text"":""北京""},{""Text"":""广州""},{""Text"":""南京""},{""Text"":""杭州""},{""Text"":""深圳""}]}}}"
    ");*/
   using System;
   using System.Collections.Generic;
   using Newtonsoft.Json;

   public partial class _Default : System.Web.UI.Page
   {
       private string jsonString = @"[
           { 'id': '1', 'text': '电脑整机', 'parentid': '0', 'children': [
       { 'id': '2', 'text': '笔记本', 'parentid': '1', 'children': [
   { 'id': '31', 'text': 'SONY', 'parentid': '2', 'children': [] },
   { 'id': '23', 'text': 'LENOVO', 'parentid': '2', 'children': [] },
   { 'id': '25', 'text': 'IBM', 'parentid': '2', 'children': [] },
   { 'id': '26', 'text': '宏基', 'parentid': '2', 'children': [] },
   { 'id': '27', 'text': '联想', 'parentid': '2', 'children': [] },
   { 'id': '28', 'text': '联想2', 'parentid': '2', 'children': [] }
      ]
       },
   { 'id': '3', 'text': '上网本', 'parentid': '1', 'children': [] },
   { 'id': '4', 'text': '平板电脑', 'parentid': '1', 'children': [] },
   { 'id': '5', 'text': '台式机', 'parentid': '1', 'children': [] },
   { 'id': '6', 'text': '服务器', 'parentid': '1', 'children': [] }
   ]
           },
      { 'id': '7', 'text': '电脑配件', 'parentid': '0', 'children': [
   { 'id': '8', 'text': 'CPU', 'parentid': '7', 'children': [] },
   { 'id': '9', 'text': '主板', 'parentid': '7', 'children': [] },
   { 'id': '10', 'text': '显卡', 'parentid': '7', 'children': [] },
   { 'id': '11', 'text': '硬盘', 'parentid': '7', 'children': [] },
   { 'id': '12', 'text': '内存', 'parentid': '7', 'children': [] },
   { 'id': '13', 'text': '机箱', 'parentid': '7', 'children': [] },
   { 'id': '14', 'text': '电源', 'parentid': '7', 'children': [] },
   { 'id': '15', 'text': '显示器', 'parentid': '7', 'children': [] },
   { 'id': '16', 'text': '刻录机/光驱', 'parentid': '7', 'children': [] },
   { 'id': '17', 'text': '声卡', 'parentid': '7', 'children': [] },
   { 'id': '18', 'text': '扩展卡', 'parentid': '7', 'children': [] }
   ]
      },
       { 'id': '32', 'text': '手机', 'parentid': '0', 'children': [
     {
         'id': '33', 'text': '诺基亚', 'parentid': '32', 'children': [
                                     { 'id': '34', 'text': '华为', 'parentid': '32', 'children': [] }
                                     ]
     },
                                 { 'id': '34', 'text': '华为', 'parentid': '32', 'children': [] },
                                 { 'id': '34', 'text': '三星', 'parentid': '32', 'children': [] },
                                 { 'id': '34', 'text': '小米', 'parentid': '32', 'children': [] },
                                 { 'id': '34', 'text': '苹果', 'parentid': '32', 'children': [] }
                                                                    	]
       },
                               { 'id': '5', 'text': '篮球', 'parentId': '1', 'children': [] }
   ];";

       protected void Page_Load(object sender, EventArgs e)
       {
           treeNode rootNode = new treeNode();
           rootNode.id="1";
           rootNode.text="电脑整机";
           rootNode.parentid="0";

           treeNode childNode1 = new treeNode();
           childNode1.id="2";
           childNode1.text="笔记本";
           childNode1.parentid="1";

           treeNode childNode2 = new treeNode();
           childNode2.id="3";
           childNode2.text="SONY";
           childNode2.parentid="1";

           if (rootNode.children == null)
               rootNode.children = new List<treeNode>();

           rootNode.children.Add(childNode1);
           rootNode.children.Add(childNode2);

           string json = JsonConvert.SerializeObject(rootNode, Formatting.Indented);
       }

       /// <summary>
       /// 树结构(根据js插件定义的数据结构)
       /// </summary>
       public class treeNode
       {
           private string _id;

           private string _text;

           private string _parentid;

           private List<treeNode> _children;

           public string id
           {
               get { return _id; }
               set { _id = value; }
           }
           public string text
           {
               get { return _text; }
               set { _text = value; }
           }
           public string parentid
           {
               get { return _parentid; }
               set { _parentid = value; }
           }
           public List<treeNode> children
           {
               get { return _children; }
               set { _children = value; }
           }
       }
   }

%>