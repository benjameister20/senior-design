(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{116:function(e,t,a){"use strict";a.r(t);var s,i=a(0),l=a.n(i),o=a(16),r=a.n(o),n=(a(91),a(9)),d=a(10),c=a(13),h=a(11),u=a(5),m=a(12),p=a(152),b=a(163),v=a(8),w=a.n(v),f="https://parseltongue-dev.herokuapp.com/",k=[{vendor:"a",modelNumber:"a",height:"a",displayColor:"a",ethernetPorts:"a",powerPorts:"a",cpu:"a",memory:"a",storage:"a",comments:"a"},{vendor:"b",modelNumber:"b",height:"b",displayColor:"b",ethernetPorts:"b",powerPorts:"b",cpu:"b",memory:"b",storage:"b",comments:"b"},{vendor:"c",modelNumber:"c",height:"c",displayColor:"c",ethernetPorts:"c",powerPorts:"c",cpu:"c",memory:"c",storage:"c",comments:"c"}],g=[{username:"a",password:"a",displayName:"a",email:"a",privilege:"a"},{username:"b",password:"b",displayName:"b",email:"b",privilege:"b"},{username:"c",password:"c",displayName:"c",email:"c",privilege:"c"}],M=[{model:"a",hostname:"a",rack:"a",rackU:"a",owner:"a",comment:"a"},{model:"b",hostname:"b",rack:"b",rackU:"b",owner:"b",comment:"b"},{model:"c",hostname:"c",rack:"c",rackU:"c",owner:"c",comment:"c"}];function y(e,t){return f+e+t}!function(e){e.ADMIN="admin",e.USER="user"}(s||(s={}));var C,V,E=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={username:"",password:"",message:""},a.submitCredentials=a.submitCredentials.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"submitCredentials",value:function(){var e=this;w.a.post(y("users/","authenticate"),{username:this.state.username,password:this.state.password}).then((function(t){"success"==t.data.message?(e.setState({message:""}),e.props.loginFunc(t.data.token,t.data.privilege)):e.setState({message:t.data.message})}))}},{key:"updateUsername",value:function(e){this.setState({username:e.target.value})}},{key:"updatePassword",value:function(e){this.setState({password:e.target.value})}},{key:"render",value:function(){return l.a.createElement("div",null,this.state.message,l.a.createElement(b.a,{id:"outlined-basic",label:"Username",variant:"outlined",required:"true",ref:"username",onChange:this.updateUsername.bind(this)}),l.a.createElement(b.a,{id:"outlined-basic",label:"Password",variant:"outlined",required:"true",ref:"password",onChange:this.updatePassword.bind(this)}),l.a.createElement(p.a,{onClick:this.submitCredentials,variant:"contained",color:"primary"},"Sign In"))}}]),t}(l.a.Component),I=(a(73),a(74),a(160)),O=a(161),j=a(165),U=a(162),D=a(159);a(164);!function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(C||(C={})),function(e){e.Vendor="vendor",e.ModelNumber="modelNumber",e.Height="height",e.DisplayColor="displayColor",e.EthernetPorts="ethernetPorts",e.PowerPorts="powerPorts",e.CPU="cpu",e.Memory="memory",e.Storage="storage",e.Comment="comments"}(V||(V={}));var S,N,P=a(154),T=a(158),x=a(157),L=a(153),R=a(155),G=a(156),H=a(117),A=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"showDetailedView",value:function(e){this.props.showDetailedView(e.target.id)}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,l.a.createElement(L.a,{component:H.a},l.a.createElement(P.a,{className:{minWidth:650},"aria-label":"simple table"},l.a.createElement(R.a,null,l.a.createElement(G.a,null,this.props.columns.map((function(e){return l.a.createElement(x.a,null,l.a.createElement("span",{id:e},e))})))),l.a.createElement(T.a,null,this.props.vals.map((function(t,a){return l.a.createElement(G.a,null,e.props.keys.map((function(s){return l.a.createElement(x.a,{scope:"row"},l.a.createElement("span",{id:a,onClick:e.showDetailedView.bind(e)},t[s]))})))}))))))}}]),t}(l.a.Component),B=a(38),_=a(70),q=a.n(_),F=a(71),J=a.n(F),W=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.openCreateModal},"Create"),l.a.createElement(p.a,{variant:"contained",color:"primary",startIcon:l.a.createElement(q.a,null),onClick:this.props.openImportModal},"Import"),l.a.createElement(p.a,{variant:"contained",color:"primary",startIcon:l.a.createElement(J.a,null),onClick:this.props.downloadTable},"Export"))}}]),t}(l.a.Component),z=a(72),K=a.n(z),Q=a(167),X=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={filters:{}},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"updateSearchText",value:function(e){if(this.state.filters.hasOwnProperty(e.target.id))this.state.filters[e.target.id]=e.target.value,this.forceUpdate();else{null==e.target.value||e.target.value;this.state.filters[e.target.id]=e.target.value,this.forceUpdate()}}},{key:"search",value:function(){this.props.search(this.state.filters)}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,this.props.filters.map((function(t,a){return l.a.createElement("div",null,l.a.createElement(K.a,null),l.a.createElement(Q.a,{placeholder:t+" filter",inputProps:{"aria-label":"search"},onChange:e.updateSearchText.bind(e),id:t}))})),l.a.createElement("div",null,l.a.createElement(p.a,{onClick:this.search.bind(this)},"Search")))}}]),t}(l.a.Component),Y=a(166),Z=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){return l.a.createElement(Y.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",bgcolor:"text.secondary"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.props.showImportModal,onClose:this.props.closeImportModal},l.a.createElement("div",null,l.a.createElement("input",{type:"file",accept:".csv"}),l.a.createElement(p.a,{variant:"contained",color:"primary"},"Upload")))}}]),t}(l.a.Component),$=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={showConfirmationBox:!1},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"closeModal",value:function(){this.setState({showConfirmationBox:!1})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,l.a.createElement(Y.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",bgcolor:"text.secondary"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.props.showDetailedView,onClose:this.props.closeDetailedView},l.a.createElement("div",null,this.props.inputs.map((function(t){return l.a.createElement(b.a,{disabled:e.props.disabled,id:"standard-basic",label:t,onChange:e.props.updateModelEdited,defaultValue:e.props.defaultValues[t]})})),this.props.disabled?null:l.a.createElement("div",null,l.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.edit},"Save"),l.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.delete},"Delete")),l.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.closeDetailedView},"Close"))))}}]),t}(l.a.Component),ee=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this;return l.a.createElement("div",null,l.a.createElement(Y.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",bgcolor:"text.secondary"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.props.showCreateModal,onClose:this.props.closeCreateModal},l.a.createElement("div",null,this.props.inputs.map((function(t){return l.a.createElement(b.a,{id:"standard-basic",label:t,name:t,onChange:e.props.updateModelCreator})})),l.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.createModel},"Create"))))}}]),t}(l.a.Component),te=["vendor","modelNumber","height","displayColor","ethernetPorts","powerPorts","cpu","memory","storage","comments"],ae=["vendor","modelNumber","height"],se=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:k,createdModel:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},createdVendor:"",createdModelNum:"",createdHeight:"",createdDispClr:"",createdEthPorts:"",createdPwrPorts:"",createdCPU:"",createdMem:"",createdStorage:"",createdComments:"",deleteVendor:"",deleteModel:"",viewVendor:"",viewModel:"",searchText:"",csvData:[],showDetailedView:!1,detailViewLoading:!1,detailedValues:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""}},a.openCreateModal=a.openCreateModal.bind(Object(u.a)(a)),a.openImportModal=a.openImportModal.bind(Object(u.a)(a)),a.downloadTable=a.downloadTable.bind(Object(u.a)(a)),a.updateSearchText=a.updateSearchText.bind(Object(u.a)(a)),a.search=a.search.bind(Object(u.a)(a)),a.closeImportModal=a.closeImportModal.bind(Object(u.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(u.a)(a)),a.showDetailedView=a.showDetailedView.bind(Object(u.a)(a)),a.editModel=a.editModel.bind(Object(u.a)(a)),a.closeDetailedView=a.closeDetailedView.bind(Object(u.a)(a)),a.updateModelEdited=a.updateModelEdited.bind(Object(u.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(u.a)(a)),a.createModel=a.createModel.bind(Object(u.a)(a)),a.updateModelCreator=a.updateModelCreator.bind(Object(u.a)(a)),a.deleteModel=a.deleteModel.bind(Object(u.a)(a)),w.a.defaults.headers.common.token=a.props.token,w.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"createModel",value:function(){w.a.post(y("models/",C.create),{vendor:this.state.createdModel[V.Vendor],modelNumber:this.state.createdModel[V.ModelNumber],height:this.state.createdModel[V.Height],displayColor:this.state.createdModel[V.DisplayColor],ethernetPorts:this.state.createdModel[V.EthernetPorts],powerPorts:this.state.createdModel[V.PowerPorts],cpu:this.state.createdModel[V.CPU],memory:this.state.createdModel[V.Memory],storage:this.state.createdModel[V.Storage],comments:this.state.createdModel[V.Comment]}).then((function(e){return console.log(e)})),this.setState({createdModel:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},showCreateModal:!1})}},{key:"editModel",value:function(){w.a.post(y("models/",C.edit),{vendor:this.state.detailedValues[V.Vendor],modelNumber:this.state.detailedValues[V.ModelNumber],height:this.state.detailedValues[V.Height],displayColor:this.state.detailedValues[V.DisplayColor],ethernetPorts:this.state.detailedValues[V.EthernetPorts],powerPorts:this.state.detailedValues[V.PowerPorts],cpu:this.state.detailedValues[V.CPU],memory:this.state.detailedValues[V.Memory],storage:this.state.detailedValues[V.Storage],comments:this.state.detailedValues[V.Comment]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},showDetailedView:!1})}},{key:"deleteModel",value:function(){w.a.post(y("models/",C.delete),{vendor:this.state.detailedValues[V.Vendor],modelNumber:this.state.detailedValues[V.ModelNumber]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},showDetailedView:!1})}},{key:"detailViewModel",value:function(e,t){var a=this;w.a.post(y("models/",C.detailView),{vendor:e,modelNumber:t},this.props.headers).then((function(e){return a.setState({detailedValues:e.data.models[0],detailViewLoading:!1})})),this.setState({viewVendor:"",viewModel:""})}},{key:"searchModels",value:function(e,t,a){var s=this;w.a.post(y("models/",C.search),{vendor:e,modelNumber:t,height:a}).then((function(e){return s.setState({items:e.data.models})})),this.setState({searchText:""})}},{key:"search",value:function(e){this.searchModels(e.vendor,e.modelNumber,e.height)}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"showDetailedView",value:function(e){this.setState({showDetailedView:!0,detailViewLoading:!0});this.state.items[e].vendor,this.state.items[e].modelNumber;this.setState({detailedValues:k[e],detailViewLoading:!1})}},{key:"closeCreateModal",value:function(){this.setState({showCreateModal:!1})}},{key:"closeImportModal",value:function(){this.setState({showImportModal:!1})}},{key:"closeDetailedView",value:function(){this.setState({showDetailedView:!1})}},{key:"updateModelCreator",value:function(e){this.state.createdModel[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateModelEdited",value:function(e){this.state.detailedValues[e.target.label]=e.target.value,this.forceUpdate()}},{key:"updateSearchText",value:function(e){this.setState({searchText:e.target.value})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,this.props.privilege==s.ADMIN?l.a.createElement("div",null,l.a.createElement(W,{openCreateModal:this.openCreateModal,openImportModal:this.openImportModal,downloadTable:this.downloadTable}),l.a.createElement(B.CSVLink,{data:this.state.csvData,filename:"models.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),l.a.createElement(ee,{showCreateModal:this.state.showCreateModal,closeCreateModal:this.closeCreateModal,createModel:this.createModel,updateModelCreator:this.updateModelCreator,inputs:te}),l.a.createElement(Z,{showImportModal:this.state.showImportModal,closeImportModal:this.closeImportModal})):null,l.a.createElement(X,{updateSearchText:this.updateSearchText,search:this.search,filters:ae}),l.a.createElement(A,{columns:ae,vals:this.state.items,keys:ae,showDetailedView:this.showDetailedView,filters:ae}),l.a.createElement($,{showDetailedView:this.state.showDetailedView,closeDetailedView:this.closeDetailedView,inputs:te,updateModelEdited:this.updateModelEdited,defaultValues:this.state.detailedValues,loading:this.state.detailViewLoading,edit:this.editModel,delete:this.deleteModel,disabled:this.props.privilege==s.USER}))}}]),t}(l.a.Component);!function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(S||(S={})),function(e){e.Username="username",e.Password="password",e.Email="email",e.DisplayName="displayName",e.Privilege="privilege"}(N||(N={}));var ie,le,oe=["username","email","displayName","privilege","password"],re=["username","email","displayName","privilege"],ne=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],createdUser:{username:"",password:"",displayName:"",email:"",privilege:""},deleteUsername:"",viewUser:"",csvData:[],showDetailedView:!1,detailViewLoading:!1,detailedValues:{username:"",displayName:"",email:"",privilege:""}},a.createUser=a.createUser.bind(Object(u.a)(a)),a.editUser=a.editUser.bind(Object(u.a)(a)),a.deleteUser=a.deleteUser.bind(Object(u.a)(a)),a.detailViewUser=a.detailViewUser.bind(Object(u.a)(a)),a.searchUsers=a.searchUsers.bind(Object(u.a)(a)),a.search=a.search.bind(Object(u.a)(a)),a.openCreateModal=a.openCreateModal.bind(Object(u.a)(a)),a.openImportModal=a.openImportModal.bind(Object(u.a)(a)),a.showDetailedView=a.showDetailedView.bind(Object(u.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(u.a)(a)),a.closeImportModal=a.closeImportModal.bind(Object(u.a)(a)),a.closeDetailedView=a.closeDetailedView.bind(Object(u.a)(a)),a.updateUserCreator=a.updateUserCreator.bind(Object(u.a)(a)),a.updateUserEdited=a.updateUserEdited.bind(Object(u.a)(a)),w.a.defaults.headers.common.token=a.props.token,w.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"createUser",value:function(){w.a.post(y("users/",S.create),{username:this.state.createdUser[N.Username],password:this.state.createdUser[N.Password],displayName:this.state.createdUser[N.DisplayName],email:this.state.createdUser[N.Email],privilege:this.state.createdUser[N.Privilege]}).then((function(e){return console.log(e)})),this.setState({createdUser:{username:"",password:"",displayName:"",email:"",privilege:""},showCreateModal:!1})}},{key:"editUser",value:function(){w.a.post(y("users/",S.edit),{username:this.state.detailedValues[N.Username],displayName:this.state.detailedValues[N.DisplayName],email:this.state.detailedValues[N.Email],privilege:this.state.detailedValues[N.Privilege]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{username:"",displayName:"",email:"",privilege:""},showDetailedView:!1})}},{key:"deleteUser",value:function(){w.a.post(y("users/",S.delete),{username:this.state.deleteUsername}).then((function(e){return console.log(e)})),this.setState({deleteUsername:"",showDetailedView:!1})}},{key:"detailViewUser",value:function(e){var t=this;w.a.post(y("users/",S.detailView),{username:e}).then((function(e){return t.setState({detailedValues:e.data.users[0],detailViewLoading:!1})})),this.setState({viewUser:""})}},{key:"searchUsers",value:function(e,t,a,s){var i=this;w.a.post(y("users/",S.search),{username:e,email:t,displayName:a,privilege:s}).then((function(e){return i.setState({items:e.data.users})}))}},{key:"search",value:function(e){this.searchUsers(e.username,e.email,e.displayName,e.privilege)}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"showDetailedView",value:function(e){this.setState({showDetailedView:!0,detailViewLoading:!0});this.state.items[e].username,this.state.items[e].email,this.state.items[e].displayName,this.state.items[e].privilege;this.setState({detailedValues:g[e],detailViewLoading:!1})}},{key:"closeCreateModal",value:function(){this.setState({showCreateModal:!1})}},{key:"closeImportModal",value:function(){this.setState({showImportModal:!1})}},{key:"closeDetailedView",value:function(){this.setState({showDetailedView:!1})}},{key:"updateUserCreator",value:function(e){this.state.createdUser[e.target.label]=e.target.value,this.forceUpdate()}},{key:"updateUserEdited",value:function(e){this.state.detailedValues[e.target.label]=e.target.value,this.forceUpdate()}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,this.props.privilege==s.ADMIN?l.a.createElement("div",null,l.a.createElement(W,{openCreateModal:this.openCreateModal,openImportModal:this.openImportModal,downloadTable:this.downloadTable}),l.a.createElement(B.CSVLink,{data:this.state.csvData,filename:"users.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),l.a.createElement(ee,{showCreateModal:this.state.showCreateModal,closeCreateModal:this.closeCreateModal,createModel:this.createUser,updateModelCreator:this.updateUserCreator,inputs:oe}),l.a.createElement(Z,{showImportModal:this.state.showImportModal,closeImportModal:this.closeImportModal})):null,l.a.createElement(X,{updateSearchText:this.updateSearchText,search:this.search,filters:re}),l.a.createElement(A,{columns:re,vals:this.state.items,keys:re,showDetailedView:this.showDetailedView,filters:re}),l.a.createElement($,{showDetailedView:this.state.showDetailedView,closeDetailedView:this.closeDetailedView,inputs:oe,updateModelEdited:this.updateUserEdited,defaultValues:this.state.detailedValues,loading:this.state.detailViewLoading,edit:this.editUser,delete:this.deleteUser}))}}]),t}(l.a.Component);!function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(ie||(ie={})),function(e){e.Model="model",e.Hostname="hostname",e.Rack="rack",e.RackU="rackU",e.Owner="owner",e.Comment="comment"}(le||(le={}));var de=["model","hostname","rack","rackU","owner","comment"],ce=["model","hostname","rack","rackU"],he=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],createdInstance:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""},deleteInstanceRack:"",deleteInstanceRackU:"",viewInstanceRack:"",viewInstanceRackU:"",csvData:[],showDetailedView:!1,detailViewLoading:!1,detailedValues:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""}},a.createInstance=a.createInstance.bind(Object(u.a)(a)),a.editInstance=a.editInstance.bind(Object(u.a)(a)),a.deleteInstance=a.deleteInstance.bind(Object(u.a)(a)),a.detailViewInstance=a.detailViewInstance.bind(Object(u.a)(a)),a.searchInstances=a.searchInstances.bind(Object(u.a)(a)),a.search=a.search.bind(Object(u.a)(a)),a.openCreateModal=a.openCreateModal.bind(Object(u.a)(a)),a.openImportModal=a.openImportModal.bind(Object(u.a)(a)),a.showDetailedView=a.showDetailedView.bind(Object(u.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(u.a)(a)),a.closeImportModal=a.closeImportModal.bind(Object(u.a)(a)),a.closeDetailedView=a.closeDetailedView.bind(Object(u.a)(a)),a.updateInstanceCreator=a.updateInstanceCreator.bind(Object(u.a)(a)),a.updateInstanceEdited=a.updateInstanceEdited.bind(Object(u.a)(a)),w.a.defaults.headers.common.token=a.props.token,w.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"createInstance",value:function(){w.a.post(y("instances/",ie.create),{model:this.state.createdInstance[le.Model],hostname:this.state.createdInstance[le.Hostname],rack:this.state.createdInstance[le.Rack],rackU:this.state.createdInstance[le.RackU],owner:this.state.createdInstance[le.Owner],comment:this.state.createdInstance[le.Comment]}).then((function(e){return console.log(e)})),this.setState({createdInstance:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""},showCreateModal:!1})}},{key:"editInstance",value:function(){w.a.post(y("instances/",ie.edit),{model:this.state.detailedValues[le.Model],hostname:this.state.detailedValues[le.Hostname],rack:this.state.detailedValues[le.Rack],rackU:this.state.detailedValues[le.RackU],owner:this.state.detailedValues[le.Owner],comment:this.state.detailedValues[le.Comment]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""},showDetailedView:!1})}},{key:"deleteInstance",value:function(){w.a.post(y("instances/",ie.delete),{rack:this.state.deleteInstanceRack,rackU:this.state.deleteInstanceRackU}).then((function(e){return console.log(e)})),this.setState({deleteInstanceRack:"",deleteInstanceRackU:"",showDetailedView:!1})}},{key:"detailViewInstance",value:function(e,t){var a=this;w.a.post(y("instances/",ie.detailView),{rack:e,rackU:t}).then((function(e){return a.setState({detailedValues:e.data.instances[0],detailViewLoading:!1})})),this.setState({viewInstanceRack:""})}},{key:"searchInstances",value:function(e,t,a,s){var i=this;w.a.post(y("instances/",ie.search),{model:e,hostname:t,rack:a,rackU:s}).then((function(e){return i.setState({items:e.data.instances})}))}},{key:"search",value:function(e){this.searchInstances(e.model,e.hostname,e.rack,e.rackU)}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"showDetailedView",value:function(e){this.setState({showDetailedView:!0,detailViewLoading:!0});this.state.items[e].model,this.state.items[e].hostname,this.state.items[e].rack,this.state.items[e].rackU;this.setState({detailedValues:M[e],detailViewLoading:!1})}},{key:"closeCreateModal",value:function(){this.setState({showCreateModal:!1})}},{key:"closeImportModal",value:function(){this.setState({showImportModal:!1})}},{key:"closeDetailedView",value:function(){this.setState({showDetailedView:!1})}},{key:"updateInstanceCreator",value:function(e){this.state.createdInstance[e.target.label]=e.target.value,this.forceUpdate()}},{key:"updateInstanceEdited",value:function(e){this.state.detailedValues[e.target.label]=e.target.value,this.forceUpdate()}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,this.props.privilege==s.ADMIN?l.a.createElement("div",null,l.a.createElement(W,{openCreateModal:this.openCreateModal,openImportModal:this.openImportModal,downloadTable:this.downloadTable}),l.a.createElement(B.CSVLink,{data:this.state.csvData,filename:"instances.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),l.a.createElement(ee,{showCreateModal:this.state.showCreateModal,closeCreateModal:this.closeCreateModal,createModel:this.createInstance,updateModelCreator:this.updateInstanceCreator,inputs:de}),l.a.createElement(Z,{showImportModal:this.state.showImportModal,closeImportModal:this.closeImportModal})):null,l.a.createElement(X,{updateSearchText:this.updateSearchText,search:this.search,filters:ce}),l.a.createElement(A,{columns:ce,vals:this.state.items,keys:ce,showDetailedView:this.showDetailedView,filters:ce}),l.a.createElement($,{showDetailedView:this.state.showDetailedView,closeDetailedView:this.closeDetailedView,inputs:de,updateModelEdited:this.updateInstanceEdited,defaultValues:this.state.detailedValues,loading:this.state.detailViewLoading,edit:this.editInstance,delete:this.deleteInstance}))}}]),t}(l.a.Component);function ue(e){return l.a.createElement("div",null)}function me(e){return l.a.createElement("div",null)}Object(I.a)((function(e){return{root:{flexGrow:1,backgroundColor:e.palette.background.paper},tab:{flexGrow:1},button:{flexGrow:1}}}));var pe=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={currentTabID:0},a.handleChange=a.handleChange.bind(Object(u.a)(a)),a.logout=a.logout.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"handleChange",value:function(e,t){this.setState({currentTabID:t})}},{key:"logout",value:function(){}},{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement(O.a,{position:"static"},l.a.createElement(j.a,{value:this.state.currentTabID,onChange:this.handleChange},l.a.createElement(U.a,{value:0,style:{flexGrow:1},label:"Models"}," "),l.a.createElement(U.a,{value:1,style:{flexGrow:1},label:"Instances"}),this.props.privilege==s.ADMIN?l.a.createElement(U.a,{value:2,style:{flexGrow:1},label:"Users"}):null,l.a.createElement(U.a,{value:3,style:{flexGrow:1},label:"Racks"}),l.a.createElement(U.a,{value:4,style:{flexGrow:1},label:"Statistics"}),l.a.createElement(p.a,{style:{flexGrow:1},variant:"contained",color:"secondary",onClick:this.logout},"Logout"))),l.a.createElement(D.a,{component:"div",role:"tabpanel",hidden:0!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},l.a.createElement(se,{token:this.props.token,privilege:this.props.privilege})),l.a.createElement(D.a,{component:"div",role:"tabpanel",hidden:1!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},l.a.createElement(he,{token:this.props.token,privilege:this.props.privilege})),l.a.createElement(D.a,{component:"div",role:"tabpanel",hidden:2!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},l.a.createElement(ne,{token:this.props.token,privilege:this.props.privilege})),l.a.createElement(D.a,{component:"div",role:"tabpanel",hidden:3!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},l.a.createElement(ue,{token:this.props.token,privilege:this.props.privilege})),l.a.createElement(D.a,{component:"div",role:"tabpanel",hidden:4!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},l.a.createElement(me,{token:this.props.token,privilege:this.props.privilege})))}}]),t}(l.a.Component),be=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={token:"",privilege:"",loggedIn:!1},a.login=a.login.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"login",value:function(e,t){this.setState({token:e,privilege:t,loggedIn:!0})}},{key:"render",value:function(){return l.a.createElement("div",null,this.state.loggedIn?l.a.createElement(pe,{token:this.state.token,privilege:this.state.privilege}):l.a.createElement(E,{loginFunc:this.login}))}}]),t}(l.a.Component);r.a.render(l.a.createElement(be,null),document.getElementById("root"))},86:function(e,t,a){e.exports=a(116)},91:function(e,t,a){}},[[86,1,2]]]);
//# sourceMappingURL=main.a684ca70.chunk.js.map
