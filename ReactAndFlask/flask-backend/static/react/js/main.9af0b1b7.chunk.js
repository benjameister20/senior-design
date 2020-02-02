(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{104:function(e,t,a){e.exports=a(137)},109:function(e,t,a){},137:function(e,t,a){"use strict";a.r(t);var s,n=a(0),i=a.n(n),r=a(15),l=a.n(r),o=(a(109),a(9)),c=a(10),d=a(12),u=a(11),h=a(5),m=a(13),p=a(178),v=a(194),g=a(8),b=a.n(g),w="http://localhost:4010/",k=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","W","X","Y","Z"],f=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];function E(e,t){return w+e+t}!function(e){e.ADMIN="admin",e.USER="user"}(s||(s={}));var y,S,M=a(190),C=a(139),O=a(170),V=a(83),j=a.n(V),U=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(O.a,{in:this.props.open},i.a.createElement(M.a,{severity:this.props.severity,action:i.a.createElement(C.a,{"aria-label":"close",color:"inherit",size:"small",onClick:this.props.closeStatus},i.a.createElement(j.a,{fontSize:"inherit"}))},this.props.message)))}}]),t}(i.a.Component),I=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={username:"",password:"",statusMessage:"",showStatus:!1,statusSeverity:""},a.closeShowStatus=a.closeShowStatus.bind(Object(h.a)(a)),a.submitCredentials=a.submitCredentials.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"submitCredentials",value:function(){var e=this;b.a.post(E("users/","authenticate"),{username:this.state.username,password:this.state.password}).then((function(t){"success"==t.data.message?(e.setState({message:""}),e.props.loginFunc(t.data.token,t.data.privilege)):e.setState({showStatus:!0,statusMessage:t.data.message})}))}},{key:"updateUsername",value:function(e){this.setState({username:e.target.value})}},{key:"updatePassword",value:function(e){this.setState({password:e.target.value})}},{key:"closeShowStatus",value:function(){this.setState({showStatus:!1})}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(U,{open:this.state.showStatus,severity:this.state.statusSeverity,closeStatus:this.closeShowStatus,message:this.state.statusMessage}),i.a.createElement(v.a,{id:"outlined-basic",label:"Username",variant:"outlined",required:"true",ref:"username",onChange:this.updateUsername.bind(this)}),i.a.createElement(v.a,{id:"outlined-basic",label:"Password",variant:"outlined",required:"true",ref:"password",type:"password",onChange:this.updatePassword.bind(this)}),i.a.createElement(p.a,{onClick:this.submitCredentials,variant:"contained",color:"primary"},"Sign In"))}}]),t}(i.a.Component),D=a(188),R=a(192),N=a(189);!function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(y||(y={})),function(e){e.Vendor="vendor",e.ModelNumber="modelNumber",e.Height="height",e.DisplayColor="displayColor",e.EthernetPorts="ethernetPorts",e.PowerPorts="powerPorts",e.CPU="cpu",e.Memory="memory",e.Storage="storage",e.Comment="comments"}(S||(S={}));var T,L,P=a(180),_=a(184),A=a(183),x=a(179),G=a(181),K=a(182),F=a(138),H=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"showDetailedView",value:function(e){this.props.showDetailedView(e.target.id)}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement(x.a,{component:F.a},i.a.createElement(P.a,{className:{minWidth:650},"aria-label":"simple table"},i.a.createElement(G.a,null,i.a.createElement(K.a,null,this.props.columns.map((function(e){return i.a.createElement(A.a,null,i.a.createElement("span",{id:e},e))})))),i.a.createElement(_.a,null,this.props.vals.map((function(t,a){return i.a.createElement(K.a,null,e.props.keys.map((function(s){return i.a.createElement(A.a,{scope:"row"},i.a.createElement("span",{id:a,onClick:e.showDetailedView.bind(e)},t[s]))})))}))))))}}]),t}(i.a.Component),B=a(40),J=a(84),q=a.n(J),z=a(85),W=a.n(z),Q=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.openCreateModal},"Create"),i.a.createElement(p.a,{variant:"contained",color:"primary",startIcon:i.a.createElement(q.a,null),onClick:this.props.openImportModal},"Import"),i.a.createElement(p.a,{variant:"contained",color:"primary",startIcon:i.a.createElement(W.a,null),onClick:this.props.downloadTable},"Export"))}}]),t}(i.a.Component),X=a(86),Y=a.n(X),Z=a(88),$=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={filters:{}},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"updateSearchText",value:function(e){if(this.state.filters.hasOwnProperty(e.target.id))this.state.filters[e.target.id]=e.target.value,this.forceUpdate();else{null==e.target.value||e.target.value;this.state.filters[e.target.id]=e.target.value,this.forceUpdate()}}},{key:"search",value:function(){this.props.search(this.state.filters)}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,this.props.filters.map((function(t,a){return i.a.createElement("div",null,i.a.createElement(Y.a,null),i.a.createElement(Z.a,{placeholder:t+" filter",inputProps:{"aria-label":"search"},onChange:e.updateSearchText.bind(e),id:t}))})),i.a.createElement("div",null,i.a.createElement(p.a,{onClick:this.search.bind(this)},"Search")))}}]),t}(i.a.Component),ee=a(193),te=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return i.a.createElement(ee.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.props.showImportModal,onClose:this.props.closeImportModal},i.a.createElement("div",null,i.a.createElement("input",{type:"file",accept:".csv"}),i.a.createElement(p.a,{variant:"contained",color:"primary"},"Upload")))}}]),t}(i.a.Component),ae=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={showConfirmationBox:!1},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"closeModal",value:function(){this.setState({showConfirmationBox:!1})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement(ee.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.props.showDetailedView,onClose:this.props.closeDetailedView},i.a.createElement("div",null,this.props.inputs.map((function(t){return i.a.createElement(v.a,{disabled:e.props.disabled,id:"standard-basic",label:t,onChange:e.props.updateModelEdited,defaultValue:e.props.defaultValues[t]})})),this.props.disabled?null:i.a.createElement("div",null,i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.edit},"Save"),i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.delete},"Delete")),i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.closeDetailedView},"Close"))))}}]),t}(i.a.Component),se=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={},a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement(ee.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.props.showCreateModal,onClose:this.props.closeCreateModal},i.a.createElement("div",null,this.props.inputs.map((function(t){return i.a.createElement(v.a,{id:"standard-basic",label:t,name:t,onChange:e.props.updateModelCreator})})),i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.props.createModel},"Create"))))}}]),t}(i.a.Component),ne=["vendor","modelNumber","height","displayColor","ethernetPorts","powerPorts","cpu","memory","storage","comments"],ie=["vendor","modelNumber","height"],re=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],createdModel:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},createdVendor:"",createdModelNum:"",createdHeight:"",createdDispClr:"",createdEthPorts:"",createdPwrPorts:"",createdCPU:"",createdMem:"",createdStorage:"",createdComments:"",deleteVendor:"",deleteModel:"",viewVendor:"",viewModel:"",searchText:"",csvData:[],showDetailedView:!1,detailViewLoading:!1,detailedValues:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""}},a.openCreateModal=a.openCreateModal.bind(Object(h.a)(a)),a.openImportModal=a.openImportModal.bind(Object(h.a)(a)),a.downloadTable=a.downloadTable.bind(Object(h.a)(a)),a.updateSearchText=a.updateSearchText.bind(Object(h.a)(a)),a.search=a.search.bind(Object(h.a)(a)),a.closeImportModal=a.closeImportModal.bind(Object(h.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(h.a)(a)),a.showDetailedView=a.showDetailedView.bind(Object(h.a)(a)),a.editModel=a.editModel.bind(Object(h.a)(a)),a.closeDetailedView=a.closeDetailedView.bind(Object(h.a)(a)),a.updateModelEdited=a.updateModelEdited.bind(Object(h.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(h.a)(a)),a.createModel=a.createModel.bind(Object(h.a)(a)),a.updateModelCreator=a.updateModelCreator.bind(Object(h.a)(a)),a.deleteModel=a.deleteModel.bind(Object(h.a)(a)),b.a.defaults.headers.common.token=a.props.token,b.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"createModel",value:function(){var e=this;b.a.post(E("models/",y.create),{vendor:this.state.createdModel[S.Vendor],modelNumber:this.state.createdModel[S.ModelNumber],height:this.state.createdModel[S.Height],displayColor:this.state.createdModel[S.DisplayColor],ethernetPorts:this.state.createdModel[S.EthernetPorts],powerPorts:this.state.createdModel[S.PowerPorts],cpu:this.state.createdModel[S.CPU],memory:this.state.createdModel[S.Memory],storage:this.state.createdModel[S.Storage],comments:this.state.createdModel[S.Comment]}).then((function(t){"success"===t.data.message?e.setState({showStatus:!0,statusMessage:"Successfully created model",statusSeverity:"success",createdModel:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},showCreateModal:!1}):e.setState({showStatus:!0,statusMessage:t.data.message,statusSeverity:"error"})})),this.setState({createdModel:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},showCreateModal:!1})}},{key:"editModel",value:function(){b.a.post(E("models/",y.edit),{vendor:this.state.detailedValues[S.Vendor],modelNumber:this.state.detailedValues[S.ModelNumber],height:this.state.detailedValues[S.Height],displayColor:this.state.detailedValues[S.DisplayColor],ethernetPorts:this.state.detailedValues[S.EthernetPorts],powerPorts:this.state.detailedValues[S.PowerPorts],cpu:this.state.detailedValues[S.CPU],memory:this.state.detailedValues[S.Memory],storage:this.state.detailedValues[S.Storage],comments:this.state.detailedValues[S.Comment]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},showDetailedView:!1})}},{key:"deleteModel",value:function(){b.a.post(E("models/",y.delete),{vendor:this.state.detailedValues[S.Vendor],modelNumber:this.state.detailedValues[S.ModelNumber]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},showDetailedView:!1})}},{key:"detailViewModel",value:function(e,t){var a=this;b.a.post(E("models/",y.detailView),{vendor:e,modelNumber:t},this.props.headers).then((function(e){return a.setState({detailedValues:e.data.models[0],detailViewLoading:!1})})),this.setState({viewVendor:"",viewModel:""})}},{key:"searchModels",value:function(e,t,a){var s=this;b.a.post(E("models/",y.search),{filter:{vendor:e,modelNumber:t,height:a}}).then((function(e){return s.setState({items:e.data.models})})),this.setState({searchText:""})}},{key:"search",value:function(e){this.searchModels(e.vendor,e.modelNumber,e.height)}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"showDetailedView",value:function(e){this.setState({showDetailedView:!0,detailViewLoading:!0});var t=this.state.items[e].vendor,a=this.state.items[e].modelNumber;this.detailViewModel(t,a)}},{key:"closeCreateModal",value:function(){this.setState({showCreateModal:!1})}},{key:"closeImportModal",value:function(){this.setState({showImportModal:!1})}},{key:"closeDetailedView",value:function(){this.setState({showDetailedView:!1})}},{key:"updateModelCreator",value:function(e){this.state.createdModel[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateModelEdited",value:function(e){this.state.detailedValues[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateSearchText",value:function(e){this.setState({searchText:e.target.value})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,this.props.privilege==s.ADMIN?i.a.createElement("div",null,i.a.createElement(Q,{openCreateModal:this.openCreateModal,openImportModal:this.openImportModal,downloadTable:this.downloadTable}),i.a.createElement(B.CSVLink,{data:this.state.csvData,filename:"models.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),i.a.createElement(se,{showCreateModal:this.state.showCreateModal,closeCreateModal:this.closeCreateModal,createModel:this.createModel,updateModelCreator:this.updateModelCreator,inputs:ne}),i.a.createElement(te,{showImportModal:this.state.showImportModal,closeImportModal:this.closeImportModal})):null,i.a.createElement($,{updateSearchText:this.updateSearchText,search:this.search,filters:ie}),i.a.createElement(H,{columns:ie,vals:this.state.items,keys:ie,showDetailedView:this.showDetailedView,filters:ie}),i.a.createElement(ae,{showDetailedView:this.state.showDetailedView,closeDetailedView:this.closeDetailedView,inputs:ne,updateModelEdited:this.updateModelEdited,defaultValues:this.state.detailedValues,loading:this.state.detailViewLoading,edit:this.editModel,delete:this.deleteModel,disabled:this.props.privilege==s.USER}))}}]),t}(i.a.Component);!function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(T||(T={})),function(e){e.Username="username",e.Password="password",e.Email="email",e.display_name="display_name",e.Privilege="privilege"}(L||(L={}));var le,oe,ce=["username","email","display_name","privilege","password"],de=["username","email","display_name","privilege"],ue=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],createdUser:{username:"",password:"",display_name:"",email:"",privilege:""},showStatus:!1,statusMessage:"",statusSeverity:"",deleteUsername:"",viewUser:"",csvData:[],showDetailedView:!1,detailViewLoading:!1,detailedValues:{username:"",display_name:"",email:"",privilege:""}},a.createUser=a.createUser.bind(Object(h.a)(a)),a.editUser=a.editUser.bind(Object(h.a)(a)),a.deleteUser=a.deleteUser.bind(Object(h.a)(a)),a.detailViewUser=a.detailViewUser.bind(Object(h.a)(a)),a.searchUsers=a.searchUsers.bind(Object(h.a)(a)),a.search=a.search.bind(Object(h.a)(a)),a.openCreateModal=a.openCreateModal.bind(Object(h.a)(a)),a.openImportModal=a.openImportModal.bind(Object(h.a)(a)),a.showDetailedView=a.showDetailedView.bind(Object(h.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(h.a)(a)),a.closeImportModal=a.closeImportModal.bind(Object(h.a)(a)),a.closeDetailedView=a.closeDetailedView.bind(Object(h.a)(a)),a.updateUserCreator=a.updateUserCreator.bind(Object(h.a)(a)),a.updateUserEdited=a.updateUserEdited.bind(Object(h.a)(a)),a.closeShowStatus=a.closeShowStatus.bind(Object(h.a)(a)),b.a.defaults.headers.common.token=a.props.token,b.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"createUser",value:function(){var e=this;b.a.post(E("users/",T.create),{username:this.state.createdUser[L.Username],password:this.state.createdUser[L.Password],display_name:this.state.createdUser[L.display_name],email:this.state.createdUser[L.Email],privilege:this.state.createdUser[L.Privilege]}).then((function(t){"success"===t.data.message?e.setState({showStatus:!0,statusMessage:"Successfully created user",statusSeverity:"success",createdUser:{username:"",password:"",display_name:"",email:"",privilege:""},showCreateModal:!1}):e.setState({showStatus:!0,statusMessage:t.data.message,statusSeverity:"error"})}))}},{key:"editUser",value:function(){b.a.post(E("users/",T.edit),{username:this.state.detailedValues[L.Username],display_name:this.state.detailedValues[L.display_name],email:this.state.detailedValues[L.Email],privilege:this.state.detailedValues[L.Privilege]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{username:"",display_name:"",email:"",privilege:""},showDetailedView:!1})}},{key:"deleteUser",value:function(){b.a.post(E("users/",T.delete),{username:this.state.deleteUsername}).then((function(e){return console.log(e)})),this.setState({deleteUsername:"",showDetailedView:!1})}},{key:"detailViewUser",value:function(e){var t=this;b.a.post(E("users/",T.detailView),{username:e}).then((function(e){return t.setState({detailedValues:e.data.user,detailViewLoading:!1})})),this.setState({viewUser:""})}},{key:"searchUsers",value:function(e,t,a,s){var n=this;b.a.post(E("users/",T.search),{filter:{username:e,email:t,display_name:a,privilege:s}}).then((function(e){return n.setState({items:null==e.data.users?[]:e.data.users})}))}},{key:"search",value:function(e){this.searchUsers(e.username,e.email,e.display_name,e.privilege)}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"showDetailedView",value:function(e){this.setState({showDetailedView:!0,detailViewLoading:!0});var t=this.state.items[e].username,a=this.state.items[e].email,s=this.state.items[e].display_name,n=this.state.items[e].privilege;this.detailViewUser(t,a,s,n)}},{key:"closeCreateModal",value:function(){this.setState({showCreateModal:!1})}},{key:"closeImportModal",value:function(){this.setState({showImportModal:!1})}},{key:"closeDetailedView",value:function(){this.setState({showDetailedView:!1})}},{key:"updateUserCreator",value:function(e){this.state.createdUser[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateUserEdited",value:function(e){this.state.detailedValues[e.target.name]=e.target.value,this.forceUpdate()}},{key:"closeShowStatus",value:function(){this.setState({showStatus:!1})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement(U,{open:this.state.showStatus,severity:this.state.statusSeverity,closeStatus:this.closeShowStatus,message:this.state.statusMessage}),this.props.privilege==s.ADMIN?i.a.createElement("div",null,i.a.createElement(Q,{openCreateModal:this.openCreateModal,openImportModal:this.openImportModal,downloadTable:this.downloadTable}),i.a.createElement(B.CSVLink,{data:this.state.csvData,filename:"users.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),i.a.createElement(se,{showCreateModal:this.state.showCreateModal,closeCreateModal:this.closeCreateModal,createModel:this.createUser,updateModelCreator:this.updateUserCreator,inputs:ce}),i.a.createElement(te,{showImportModal:this.state.showImportModal,closeImportModal:this.closeImportModal})):null,i.a.createElement($,{updateSearchText:this.updateSearchText,search:this.search,filters:de}),i.a.createElement(H,{columns:de,vals:this.state.items,keys:de,showDetailedView:this.showDetailedView,filters:de}),i.a.createElement(ae,{showDetailedView:this.state.showDetailedView,closeDetailedView:this.closeDetailedView,inputs:de,updateModelEdited:this.updateUserEdited,defaultValues:this.state.detailedValues,loading:this.state.detailViewLoading,edit:this.editUser,delete:this.deleteUser}))}}]),t}(i.a.Component);!function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(le||(le={})),function(e){e.Model="model",e.Hostname="hostname",e.Rack="rack",e.RackU="rackU",e.Owner="owner",e.Comment="comment"}(oe||(oe={}));var he,me=["model","hostname","rack","rackU","owner","comment"],pe=["model","hostname","rack","rackU"],ve=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],createdInstance:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""},showStatus:!1,statusMessage:"",statusSeverity:"",deleteInstanceRack:"",deleteInstanceRackU:"",viewInstanceRack:"",viewInstanceRackU:"",csvData:[],showDetailedView:!1,detailViewLoading:!1,detailedValues:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""}},a.createInstance=a.createInstance.bind(Object(h.a)(a)),a.editInstance=a.editInstance.bind(Object(h.a)(a)),a.deleteInstance=a.deleteInstance.bind(Object(h.a)(a)),a.detailViewInstance=a.detailViewInstance.bind(Object(h.a)(a)),a.searchInstances=a.searchInstances.bind(Object(h.a)(a)),a.search=a.search.bind(Object(h.a)(a)),a.openCreateModal=a.openCreateModal.bind(Object(h.a)(a)),a.openImportModal=a.openImportModal.bind(Object(h.a)(a)),a.showDetailedView=a.showDetailedView.bind(Object(h.a)(a)),a.closeCreateModal=a.closeCreateModal.bind(Object(h.a)(a)),a.closeImportModal=a.closeImportModal.bind(Object(h.a)(a)),a.closeDetailedView=a.closeDetailedView.bind(Object(h.a)(a)),a.updateInstanceCreator=a.updateInstanceCreator.bind(Object(h.a)(a)),a.updateInstanceEdited=a.updateInstanceEdited.bind(Object(h.a)(a)),a.closeShowStatus=a.closeShowStatus.bind(Object(h.a)(a)),b.a.defaults.headers.common.token=a.props.token,b.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"createInstance",value:function(){var e=this;b.a.post(E("instances/",le.create),{model:this.state.createdInstance[oe.Model],hostname:this.state.createdInstance[oe.Hostname],rack:this.state.createdInstance[oe.Rack],rackU:this.state.createdInstance[oe.RackU],owner:this.state.createdInstance[oe.Owner],comment:this.state.createdInstance[oe.Comment]}).then((function(t){"success"===t.data.message?e.setState({showStatus:!0,statusMessage:"Successfully created instance",statusSeverity:"success",createdInstance:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""},showCreateModal:!1}):e.setState({showStatus:!0,statusMessage:t.data.message,statusSeverity:"error"})}))}},{key:"editInstance",value:function(){b.a.post(E("instances/",le.edit),{model:this.state.detailedValues[oe.Model],hostname:this.state.detailedValues[oe.Hostname],rack:this.state.detailedValues[oe.Rack],rackU:this.state.detailedValues[oe.RackU],owner:this.state.detailedValues[oe.Owner],comment:this.state.detailedValues[oe.Comment]}).then((function(e){return console.log(e)})),this.setState({detailedValues:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""},showDetailedView:!1})}},{key:"deleteInstance",value:function(){b.a.post(E("instances/",le.delete),{rack:this.state.deleteInstanceRack,rackU:this.state.deleteInstanceRackU}).then((function(e){return console.log(e)})),this.setState({deleteInstanceRack:"",deleteInstanceRackU:"",showDetailedView:!1})}},{key:"detailViewInstance",value:function(e,t){var a=this;b.a.post(E("instances/",le.detailView),{rack:e,rackU:t}).then((function(e){return a.setState({detailedValues:e.data.instances[0],detailViewLoading:!1})})),this.setState({viewInstanceRack:""})}},{key:"searchInstances",value:function(e,t,a,s){var n=this;b.a.post(E("instances/",le.search),{filter:{model:e,hostname:t,rack:a,rackU:s}}).then((function(e){return n.setState({items:e.data.instances})}))}},{key:"search",value:function(e){this.searchInstances(e.model,e.hostname,e.rack,e.rackU)}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"showDetailedView",value:function(e){this.setState({showDetailedView:!0,detailViewLoading:!0});var t=this.state.items[e].model,a=this.state.items[e].hostname,s=this.state.items[e].rack,n=this.state.items[e].rackU;this.detailViewInstance(t,a,s,n)}},{key:"closeCreateModal",value:function(){this.setState({showCreateModal:!1})}},{key:"closeImportModal",value:function(){this.setState({showImportModal:!1})}},{key:"closeDetailedView",value:function(){this.setState({showDetailedView:!1})}},{key:"updateInstanceCreator",value:function(e){this.state.createdInstance[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateInstanceEdited",value:function(e){this.state.detailedValues[e.target.name]=e.target.value,this.forceUpdate()}},{key:"closeShowStatus",value:function(){this.setState({showStatus:!1})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement(U,{open:this.state.showStatus,severity:this.state.statusSeverity,closeStatus:this.closeShowStatus,message:this.state.statusMessage}),this.props.privilege==s.ADMIN?i.a.createElement("div",null,i.a.createElement(Q,{openCreateModal:this.openCreateModal,openImportModal:this.openImportModal,downloadTable:this.downloadTable}),i.a.createElement(B.CSVLink,{data:this.state.csvData,filename:"instances.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),i.a.createElement(se,{showCreateModal:this.state.showCreateModal,closeCreateModal:this.closeCreateModal,createModel:this.createInstance,updateModelCreator:this.updateInstanceCreator,inputs:me}),i.a.createElement(te,{showImportModal:this.state.showImportModal,closeImportModal:this.closeImportModal})):null,i.a.createElement($,{updateSearchText:this.updateSearchText,search:this.search,filters:pe}),i.a.createElement(H,{columns:pe,vals:this.state.items,keys:pe,showDetailedView:this.showDetailedView,filters:pe}),i.a.createElement(ae,{showDetailedView:this.state.showDetailedView,closeDetailedView:this.closeDetailedView,inputs:me,updateModelEdited:this.updateInstanceEdited,defaultValues:this.state.detailedValues,loading:this.state.detailViewLoading,edit:this.editInstance,delete:this.deleteInstance}))}}]),t}(i.a.Component),ge=a(191),be=a(177),we=a(176),ke=a(197);!function(e){e.GET_ALL_RACKS="all",e.CREATE_RACKS="create",e.DELETE_RACKS="delete",e.GET_RACK_DETAILS="details"}(he||(he={}));var fe,Ee=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={items:[],startingRackLetter:"",endingRackLetter:"",startingRackNumber:-1,endingRackNumber:-1,showStatus:!1,statusMessage:"",statusSeverity:""},a.getAllRacks=a.getAllRacks.bind(Object(h.a)(a)),a.updateRacks=a.updateRacks.bind(Object(h.a)(a)),a.createRacks=a.createRacks.bind(Object(h.a)(a)),a.deleteRacks=a.deleteRacks.bind(Object(h.a)(a)),a.viewRacks=a.viewRacks.bind(Object(h.a)(a)),a.changeStartingLetter=a.changeStartingLetter.bind(Object(h.a)(a)),a.changeEndingLetter=a.changeEndingLetter.bind(Object(h.a)(a)),a.changeStartingNum=a.changeStartingNum.bind(Object(h.a)(a)),a.changeEndingNum=a.changeEndingNum.bind(Object(h.a)(a)),b.a.defaults.headers.common.token=a.props.token,b.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"getAllRacks",value:function(){var e=this;b.a.get(E("racks/",he.GET_ALL_RACKS)).then((function(t){"success"===t.data.message?e.setState({showStatus:!0,statusMessage:"Success"}):e.setState({showStatus:!0,statusMessage:t.data.message,statusSeverity:"error"})}))}},{key:"updateRacks",value:function(e){var t=this;b.a.post(E("racks/",e),{start_letter:this.state.startingRackLetter,stop_letter:this.state.endingRackLetter,start_number:this.state.startingRackNumber,stop_number:this.state.endingRackNumber}).then((function(a){"success"===a.data.message?t.setState({showStatus:!0,statusMessage:"Success"}):t.setState({showStatus:!0,statusMessage:a.data.message,statusSeverity:"error"}),e==he.GET_RACK_DETAILS&&(console.log(a.data),t.setState({items:a.data}))}))}},{key:"createRacks",value:function(){this.updateRacks(he.CREATE_RACKS)}},{key:"deleteRacks",value:function(){this.updateRacks(he.DELETE_RACKS)}},{key:"viewRacks",value:function(){this.updateRacks(he.GET_RACK_DETAILS)}},{key:"changeStartingLetter",value:function(e){this.setState({startingRackLetter:e.target.value})}},{key:"changeEndingLetter",value:function(e){this.setState({endingRackLetter:e.target.value})}},{key:"changeStartingNum",value:function(e){this.setState({startingRackNumber:e.target.value})}},{key:"changeEndingNum",value:function(e){this.setState({endingRackNumber:e.target.value})}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(U,{open:this.state.showStatus,severity:this.state.statusSeverity,closeStatus:this.closeShowStatus,message:this.state.statusMessage}),i.a.createElement(we.a,null,i.a.createElement(ge.a,{id:"starting-letter-selector",value:this.state.startingRackLetter,onChange:this.changeStartingLetter},k.map((function(e){return i.a.createElement(ke.a,{value:e},e)}))),i.a.createElement(be.a,null,"Starting Letter")),i.a.createElement(we.a,null,i.a.createElement(ge.a,{id:"ending-letter-selector",value:this.state.endingRackLetter,onChange:this.changeEndingLetter},k.map((function(e){return i.a.createElement(ke.a,{value:e},e)}))),i.a.createElement(be.a,null,"Ending Letter")),i.a.createElement(we.a,null,i.a.createElement(ge.a,{id:"starting-num-selector",value:this.state.startingRackNumber,onChange:this.changeStartingNum},f.map((function(e){return i.a.createElement(ke.a,{value:e},e)}))),i.a.createElement(be.a,null,"Starting Number")),i.a.createElement(we.a,null,i.a.createElement(ge.a,{id:"ending-num-selector",value:this.state.endingRackNumber,onChange:this.changeEndingNum},f.map((function(e){return i.a.createElement(ke.a,{value:e},e)}))),i.a.createElement(be.a,null,"Ending Number")),i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.viewRacks},"View"),this.props.privilege==s.ADMIN?i.a.createElement("div",null,i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.createRacks},"Create"),i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.deleteRacks},"Delete")):null)}}]),t}(i.a.Component),ye=a(195),Se=a(185),Me=a(187),Ce=a(186),Oe=a(87),Ve=a.n(Oe);function je(e){try{var t=JSON.parse(e)}catch(s){t=e}if(0===Object.entries(t).length&&t.constructor===Object)return[];var a=[];return Object.keys(t).map((function(e){var s=[];s.push(e),s.push(t[e]),a.push(s)})),a}!function(e){e.GENERATE_REPORT="generate-report",e.TEST="test"}(fe||(fe={}));var Ue={totalUsage:"Total Usage",spaceUsage:"Space Usage",vendorUsage:"Vendor Usage",modelUsage:"Model Usage",ownerUsage:"Owner Usage"},Ie={totalUsage:["Total","Usage"],spaceUsage:["Rack","Usage"],vendorUsage:["Vendor","Usage"],modelUsage:["Model","Usage"],ownerUsage:["Ownder","Usage"]},De=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={tableValues:{totalUsage:[],spaceUsage:[],vendorUsage:[],modelUsage:[],ownerUsage:[]},totalUsage:[],spaceUsage:[],vendorUsage:[],modelUsage:[],ownerUsage:[],showStatus:!1,statusMessage:"",statusSeverity:""},a.closeShowStatus=a.closeShowStatus.bind(Object(h.a)(a)),a.generateReport=a.generateReport.bind(Object(h.a)(a)),b.a.defaults.headers.common.token=a.props.token,b.a.defaults.headers.common.privilege=a.props.privilege,a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"generateReport",value:function(){var e=this;b.a.get(E("stats/",fe.GENERATE_REPORT)).then((function(t){try{var a=t.data,s=[],n=["Total Usage"];n.push(a.totalUsage),s.push(n);var i=je(a.spaceUsage);0==i.length&&i.push(["No space is currently being used",[]]);var r=je(a.vendorUsage);0==r.length&&r.push(["No vendors currently using space",[]]);var l=je(a.modelUsage);0==l.length&&l.push(["No models currently using space",[]]);var o=je(a.ownerUsage);0==o.length&&o.push(["No owners currently using space",[]]),e.setState({showStatus:!0,statusMessage:"Success",tableValues:{totalUsage:s,spaceUsage:i,vendorUsage:r,modelUsage:l,ownerUsage:o}})}catch(c){e.setState({showStatus:!0,statusMessage:t.data.message,statusSeverity:"error"})}}))}},{key:"closeShowStatus",value:function(){this.setState({showStatus:!1})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",null,i.a.createElement(U,{open:this.state.showStatus,severity:this.state.statusSeverity,closeStatus:this.closeShowStatus,message:this.state.statusMessage}),i.a.createElement("div",null,i.a.createElement(p.a,{variant:"contained",color:"primary",onClick:this.generateReport},"Generate New Report")),Object.keys(Ue).map((function(t){return i.a.createElement(ye.a,null,i.a.createElement(Se.a,{expandIcon:i.a.createElement(Ve.a,null)},i.a.createElement(Ce.a,null,Ue[t])),i.a.createElement(Me.a,null,i.a.createElement(x.a,{component:F.a},i.a.createElement(P.a,null,i.a.createElement(G.a,null,i.a.createElement(K.a,null,Ie[t].map((function(e){return i.a.createElement(A.a,null,i.a.createElement("span",{id:e},e))})))),i.a.createElement(_.a,null,e.state.tableValues[t].map((function(e){return i.a.createElement(K.a,null,e.map((function(e){return i.a.createElement(A.a,null,i.a.createElement("span",{id:e},e))})))})))))))})))}}]),t}(i.a.Component),Re=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={currentTabID:0},a.handleChange=a.handleChange.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"handleChange",value:function(e,t){this.setState({currentTabID:t})}},{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement(D.a,{position:"static"},i.a.createElement(R.a,{value:this.state.currentTabID,onChange:this.handleChange},i.a.createElement(N.a,{value:0,style:{flexGrow:1},label:"Models"}," "),i.a.createElement(N.a,{value:1,style:{flexGrow:1},label:"Instances"}),this.props.privilege==s.ADMIN?i.a.createElement(N.a,{value:2,style:{flexGrow:1},label:"Users"}):null,i.a.createElement(N.a,{value:3,style:{flexGrow:1},label:"Racks"}),i.a.createElement(N.a,{value:4,style:{flexGrow:1},label:"Statistics"}),i.a.createElement(p.a,{style:{flexGrow:1},variant:"contained",color:"secondary",onClick:this.props.logout},"Logout"))),i.a.createElement(Ce.a,{component:"div",role:"tabpanel",hidden:0!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},i.a.createElement(re,{token:this.props.token,privilege:this.props.privilege})),i.a.createElement(Ce.a,{component:"div",role:"tabpanel",hidden:1!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},i.a.createElement(ve,{token:this.props.token,privilege:this.props.privilege})),i.a.createElement(Ce.a,{component:"div",role:"tabpanel",hidden:2!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},i.a.createElement(ue,{token:this.props.token,privilege:this.props.privilege})),i.a.createElement(Ce.a,{component:"div",role:"tabpanel",hidden:3!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},i.a.createElement(Ee,{token:this.props.token,privilege:this.props.privilege})),i.a.createElement(Ce.a,{component:"div",role:"tabpanel",hidden:4!==this.state.currentTabID,id:"simple-tabpanel-0","aria-labelledby":"simple-tab-0"},i.a.createElement(De,{token:this.props.token,privilege:this.props.privilege})))}}]),t}(i.a.Component),Ne=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).state={token:"",privilege:"",loggedIn:!1},a.login=a.login.bind(Object(h.a)(a)),a.logout=a.logout.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"login",value:function(e,t){this.setState({token:e,privilege:t,loggedIn:!0})}},{key:"logout",value:function(){b.a.get(E("users/","logout")),this.setState({token:"",privilege:"",loggedIn:!1})}},{key:"render",value:function(){return i.a.createElement("div",null,this.state.loggedIn?i.a.createElement(Re,{token:this.state.token,privilege:this.state.privilege,logout:this.logout}):i.a.createElement(I,{loginFunc:this.login}))}}]),t}(i.a.Component);l.a.render(i.a.createElement(Ne,null),document.getElementById("root"))}},[[104,1,2]]]);
//# sourceMappingURL=main.9af0b1b7.chunk.js.map