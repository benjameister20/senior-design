(this["webpackJsonpreact-frontend"]=this["webpackJsonpreact-frontend"]||[]).push([[0],{102:function(e,t,a){},129:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(10),l=a.n(s),i=(a(102),a(82)),o=a(36),c=a(173),d=a(182),m=a(185),u=a(167),h=a(188),p=a(171),b=a(172),v=a(11),f=a.n(v);var E=Object(u.a)((function(e){return{paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},form:{marginTop:e.spacing(1)},submit:{margin:e.spacing(3,0,2)}}}));function C(e){var t=this,a=E();return r.a.createElement("div",{className:a.paper},r.a.createElement(d.a,{id:"outlined-basic",label:"Username",variant:"outlined",required:"true",ref:"username"}),r.a.createElement(d.a,{id:"outlined-basic",label:"Password",variant:"outlined",required:"true",ref:"password"}),r.a.createElement(h.a,{className:a.form},r.a.createElement(p.a,null,r.a.createElement(b.a,{value:"end",control:r.a.createElement(m.a,{color:"primary"}),label:"End",labelPlacement:"end"}))),r.a.createElement(c.a,{onClick:function(){return e=t.refs.username.getValue(),a=t.refs.password.getValue(),void f.a.post("http://localhost:4010/users/authenticate",{username:e,password:a}).then((function(e){return console.log(e)}));var e,a},variant:"contained",color:"primary",className:a.submit},"Sign In"))}var y,k,w=a(32),g=a(85),M=a(180),U=a(184),I=a(181),S=a(131),O=a(183),j=a(27),x=a(28),N=a(33),P=a(29),V=a(34);!function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(y||(y={})),function(e){e.Vendor="vendor",e.ModelNumber="modelNumber",e.Height="height",e.DisplayColor="displayColor",e.EthernetPorts="ethernetPorts",e.PowerPorts="powerPorts",e.CPU="cpu",e.Memory="memory",e.Storage="storage",e.Comment="comments"}(k||(k={}));var R="http://localhost:4010/",T=a(186),D=a(59),H=a.n(D),L=a(60),B=a.n(L),G=a(175),q=a(179),J=a(178),_=a(174),W=a(176),z=a(177),A=a(130),F=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(P.a)(t).call(this,e))).state={test:""},a}return Object(V.a)(t,e),Object(x.a)(t,[{key:"sortByCol",value:function(e){this.setState({test:e.target.id})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(_.a,{component:A.a},r.a.createElement(G.a,{className:{minWidth:650},"aria-label":"simple table"},r.a.createElement(W.a,null,r.a.createElement(z.a,null,this.props.columns.map((function(t){return r.a.createElement(J.a,null,r.a.createElement("span",{id:t,onClick:e.sortByCol.bind(e)},t))})))),r.a.createElement(q.a,null,this.props.vals.map((function(e){return r.a.createElement(z.a,null,e.map((function(e){return r.a.createElement(J.a,{scope:"row"},e)})))}))))))}}]),t}(r.a.Component),K=a(58),Q=a(43),X=a.n(Q),Y=a(187),Z=["Vendor","Model Number","Height (U)","Display Color","Ethernet Ports","Power Ports","CPU","Memory","Storage","Comments"],$="models/";function ee(e){return R+$+e}function te(e){var t=e.data.models,a=[],n=!0,r=!1,s=void 0;try{for(var l,i=t.entries()[Symbol.iterator]();!(n=(l=i.next()).done);n=!0){var o=l.value,c=Object(w.a)(o,2),d=(c[0],c[1]),m=[];m.push(d[k.Vendor]),m.push(d[k.ModelNumber]),m.push(d[k.Height]),m.push(d[k.DisplayColor]),m.push(d[k.EthernetPorts]),m.push(d[k.PowerPorts]),m.push(d[k.CPU]),m.push(d[k.Memory]),m.push(d[k.Storage]),m.push(d[k.Comment]),a.push(m)}}catch(u){r=!0,s=u}finally{try{n||null==i.return||i.return()}finally{if(r)throw s}}return a}var ae,ne,re=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(P.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],modelToken:"",createdModel:{vendor:"",modelNumber:"",height:"",displayColor:"",ethernetPorts:"",powerPorts:"",cpu:"",memory:"",storage:"",comments:""},deleteVendor:"",deleteModel:"",viewVendor:"",viewModel:"",csvData:[],searchText:""},a}return Object(V.a)(t,e),Object(x.a)(t,[{key:"createModel",value:function(){var e=this;f.a.post(ee(y.create),{vendor:this.state.createdModel[k.Vendor],modelNumber:this.state.createdModel[k.ModelNumber],height:this.state.createdModel[k.Height],displayColor:this.state.createdModel[k.DisplayColor],ethernetPorts:this.state.createdModel[k.EthernetPorts],powerPorts:this.state.createdModel[k.PowerPorts],cpu:this.state.createdModel[k.CPU],memory:this.state.createdModel[k.Memory],storage:this.state.createdModel[k.Storage],comments:this.state.createdModel[k.Comment]}).then((function(t){return e.setState({items:te(t)})}))}},{key:"deleteModel",value:function(){var e=this;f.a.post(ee(y.delete),{vendor:this.state.deleteVendor,modelNumber:this.state.deleteModel}).then((function(t){return e.setState({items:te(t)})}))}},{key:"detailViewModel",value:function(){var e=this;f.a.post(ee(y.detailView),{vendor:this.state.viewVendor,modelNumber:this.state.viewModel}).then((function(t){return e.setState({items:te(t)})}))}},{key:"viewModel",value:function(){var e=this;f.a.post(ee(y.view),{vendor:this.state.viewVendor,modelNumber:this.state.viewModel}).then((function(t){return e.setState({items:te(t)})}))}},{key:"searchModels",value:function(){var e=this;f.a.post(ee(y.search),{filter:this.state.searchText}).then((function(t){return e.setState({items:te(t)})}))}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"updateModelCreator",value:function(e){this.state.createdModel[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateSearchText",value:function(e){this.setState({searchText:e.target.value})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(c.a,{variant:"contained",color:"primary",onClick:this.openCreateModal.bind(this)},"Create"),r.a.createElement(c.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(H.a,null),onClick:this.openImportModal.bind(this)},"Import"),r.a.createElement(c.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(B.a,null),onClick:this.downloadTable.bind(this)},"Export"),r.a.createElement(K.CSVLink,{data:this.state.csvData,filename:"models.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),r.a.createElement(T.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.state.showCreateModal,onClose:function(){return e.setState({showCreateModal:!1})}},r.a.createElement("div",null,r.a.createElement(d.a,{id:"standard-basic",name:k.Vendor,label:Z[0],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.ModelNumber,label:Z[1],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.Height,label:Z[2],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.DisplayColor,label:Z[3],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.EthernetPorts,label:Z[4],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.PowerPorts,label:Z[5],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.CPU,label:Z[6],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.Memory,label:Z[7],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.Storage,label:Z[8],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:k.Comment,label:Z[9],onChange:this.updateModelCreator.bind(this)}),r.a.createElement(c.a,{variant:"contained",color:"primary",onClick:this.createModel.bind(this)},"Create"))),r.a.createElement(T.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.state.showImportModal,onClose:function(){return e.setState({showImportModal:!1})}},r.a.createElement("div",null,r.a.createElement("input",{type:"file",accept:".csv"}),r.a.createElement(c.a,{variant:"contained",color:"primary"},"Upload"))),r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(X.a,null)),r.a.createElement(Y.a,{placeholder:"Search (blank does a search all)",inputProps:{"aria-label":"search"},onChange:this.updateSearchText.bind(this)}),r.a.createElement(c.a,{onClick:this.searchModels.bind(this)},"Search")),r.a.createElement(F,{columns:Z,vals:this.state.items}))}}]),t}(r.a.Component);!function(e){e.Username="username",e.Password="password",e.Email="email",e.DisplayName="displayName"}(ae||(ae={})),function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(ne||(ne={}));var se=["Username","Display Name","Email"],le="users/";function ie(e){var t=e.data.users,a=[],n=!0,r=!1,s=void 0;try{for(var l,i=t.entries()[Symbol.iterator]();!(n=(l=i.next()).done);n=!0){var o=l.value,c=Object(w.a)(o,2),d=(c[0],c[1]),m=[];m.push(d[ae.Username]),m.push(d[ae.Email]),m.push(d[ae.DisplayName]),a.push(m)}}catch(u){r=!0,s=u}finally{try{n||null==i.return||i.return()}finally{if(r)throw s}}return a}var oe,ce,de=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(P.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],instanceToken:"",createdUser:{username:"",email:"",displayName:""},deleteUsername:"",viewUsername:"",searchText:""},a}return Object(V.a)(t,e),Object(x.a)(t,[{key:"createUser",value:function(){var e=this;f.a.post(this.getURL(ne.create),{username:this.state.createdUser[ae.Username],email:this.state.createdUser[ae.Email],displayName:this.state.createdUser[ae.DisplayName]}).then((function(t){return e.setState({items:t})}))}},{key:"deleteUser",value:function(){f.a.post(this.getURL(ne.delete),{username:this.state.deleteUsername}).then((function(e){return console.log(e)}))}},{key:"detailViewUser",value:function(){f.a.post(this.getURL(ne.detailView),{username:this.state.viewUsername}).then((function(e){return console.log(e)}))}},{key:"viewUser",value:function(){f.a.post(this.getURL(ne.view),{username:this.state.viewUsername}).then((function(e){return console.log(e)}))}},{key:"searchUsers",value:function(){var e,t=this;f.a.post((e=ne.search,R+le+e),{filter:this.state.searchText}).then((function(e){return t.setState({items:ie(e)})}))}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"updateUserCreator",value:function(e){this.state.createdUser[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateSearchText",value:function(e){this.setState({searchText:e.target.value})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(c.a,{variant:"contained",color:"primary",onClick:this.openCreateModal.bind(this)},"Create"),r.a.createElement(T.a,{"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.state.showCreateModal,onClose:function(){return e.setState({showCreateModal:!1})}},r.a.createElement("div",null,r.a.createElement(d.a,{id:"standard-basic",name:ae.Vendor,label:se[0],onChange:this.updateUserCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:ae.UserNumber,label:se[1],onChange:this.updateUserCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:ae.Height,label:se[2],onChange:this.updateUserCreator.bind(this)}),r.a.createElement(c.a,{variant:"contained",color:"primary",onClick:this.createUser.bind(this)},"Create"))),r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(X.a,null)),r.a.createElement(Y.a,{placeholder:"Search (blank does a search all)",inputProps:{"aria-label":"search"},onChange:this.updateSearchText.bind(this)}),r.a.createElement(c.a,{onClick:this.searchUsers.bind(this)},"Search")),r.a.createElement(F,{columns:se,vals:this.state.items}))}}]),t}(r.a.Component);!function(e){e.Model="model",e.Hostname="hostname",e.Rack="rack",e.RackU="rackU",e.Owner="owner",e.Comment="comment"}(oe||(oe={})),function(e){e.create="create/",e.delete="delete/",e.edit="edit/",e.view="view/",e.detailView="detailView/",e.search="search/"}(ce||(ce={}));var me=["Model","Hostname","Rack","Rack U","Owner","Comments"],ue="instances/";function he(e){return R+ue+e}function pe(e){var t=e.data.instances,a=[],n=!0,r=!1,s=void 0;try{for(var l,i=t.entries()[Symbol.iterator]();!(n=(l=i.next()).done);n=!0){var o=l.value,c=Object(w.a)(o,2),d=(c[0],c[1]),m=[];m.push(d[oe.Model]),m.push(d[oe.Hostname]),m.push(d[oe.Rack]),m.push(d[oe.RackU]),m.push(d[oe.Owner]),m.push(d[oe.Comment]),a.push(m)}}catch(u){r=!0,s=u}finally{try{n||null==i.return||i.return()}finally{if(r)throw s}}return a}var be=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(P.a)(t).call(this,e))).state={showCreateModal:!1,showImportModal:!1,items:[],instanceToken:"",createdInstance:{model:"",hostname:"",rack:"",rackU:"",owner:"",comment:""},deleteInstanceRack:"",deleteInstanceRackU:"",viewRack:"",viewRackU:"",csvData:[],searchText:""},a}return Object(V.a)(t,e),Object(x.a)(t,[{key:"createInstance",value:function(){var e=this;f.a.post(he(ce.create),{model:this.state.createdInstance[oe.Model],hostname:this.state.createdInstance[oe.Hostname],rack:this.state.createdInstance[oe.Rack],rackU:this.state.createdInstance[oe.RackU],owner:this.state.createdInstance[oe.Owner],comment:this.state.createdInstance[oe.Comment]}).then((function(t){return e.setState({items:pe(t)})}))}},{key:"deleteInstance",value:function(){var e=this;f.a.post(he(ce.delete),{rack:this.state.deleteInstanceRack,rackU:this.state.deleteInstanceRackU}).then((function(t){return e.setState({items:pe(t)})}))}},{key:"detailViewInstance",value:function(){var e=this;f.a.post(he(ce.detailView),{rack:this.state.deleteInstanceRack,rackU:this.state.deleteInstanceRackU}).then((function(t){return e.setState({items:pe(t)})}))}},{key:"viewInstance",value:function(){var e=this;f.a.post(he(ce.view),{rack:this.state.deleteInstanceRack,rackU:this.state.deleteInstanceRackU}).then((function(t){return e.setState({items:pe(t)})}))}},{key:"searchInstances",value:function(){var e=this;f.a.post(he(ce.search),{filter:this.state.searchText}).then((function(t){return e.setState({items:pe(t)})}))}},{key:"downloadTable",value:function(){this.csvLink.link.click()}},{key:"openCreateModal",value:function(){this.setState({showCreateModal:!0})}},{key:"openImportModal",value:function(){this.setState({showImportModal:!0})}},{key:"updateInstanceCreator",value:function(e){this.state.createdInstance[e.target.name]=e.target.value,this.forceUpdate()}},{key:"updateSearchText",value:function(e){this.setState({searchText:e.target.value})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(c.a,{variant:"contained",color:"primary",onClick:this.openCreateModal.bind(this)},"Create"),r.a.createElement(c.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(H.a,null),onClick:this.openImportModal.bind(this)},"Import"),r.a.createElement(c.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(B.a,null),onClick:this.downloadTable.bind(this)},"Export"),r.a.createElement(K.CSVLink,{data:this.state.csvData,filename:"instances.csv",className:"hidden",ref:function(t){return e.csvLink=t},target:"_blank"}),r.a.createElement(T.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.state.showCreateModal,onClose:function(){return e.setState({showCreateModal:!1})}},r.a.createElement("div",null,r.a.createElement(d.a,{id:"standard-basic",name:oe.Model,label:me[0],onChange:this.updateInstanceCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:oe.Hostname,label:me[1],onChange:this.updateInstanceCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:oe.Rack,label:me[2],onChange:this.updateInstanceCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:oe.RackU,label:me[3],onChange:this.updateInstanceCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:oe.Owner,label:me[4],onChange:this.updateInstanceCreator.bind(this)}),r.a.createElement(d.a,{id:"standard-basic",name:oe.Comment,label:me[5],onChange:this.updateInstanceCreator.bind(this)}),r.a.createElement(c.a,{variant:"contained",color:"primary",onClick:this.createInstance.bind(this)},"Create"))),r.a.createElement(T.a,{style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)"},"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",open:this.state.showImportModal,onClose:function(){return e.setState({showImportModal:!1})}},r.a.createElement("div",null,r.a.createElement("input",{type:"file",accept:".csv"}),r.a.createElement(c.a,{variant:"contained",color:"primary"},"Upload"))),r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement(X.a,null)),r.a.createElement(Y.a,{placeholder:"Search (blank does a search all)",inputProps:{"aria-label":"search"},onChange:this.updateSearchText.bind(this)}),r.a.createElement(c.a,{onClick:this.searchInstances.bind(this)},"Search")),r.a.createElement(F,{columns:me,vals:this.state.items}))}}]),t}(r.a.Component);function ve(e){return r.a.createElement("div",null)}function fe(e){return r.a.createElement("div",null)}function Ee(e){var t=e.children,a=e.value,n=e.index,s=Object(g.a)(e,["children","value","index"]);return r.a.createElement(S.a,Object.assign({component:"div",role:"tabpanel",hidden:a!==n,id:"simple-tabpanel-".concat(n),"aria-labelledby":"simple-tab-".concat(n)},s),a===n&&r.a.createElement(O.a,{p:3},t))}function Ce(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}var ye=Object(u.a)((function(e){return{root:{flexGrow:1,backgroundColor:e.palette.background.paper},tab:{flexGrow:1},button:{flexGrow:1}}}));function ke(){var e=ye(),t=r.a.useState(0),a=Object(w.a)(t,2),n=a[0],s=a[1];return r.a.createElement("div",{className:e.root},r.a.createElement(M.a,{position:"static"},r.a.createElement(U.a,{value:n,onChange:function(e,t){s(t)}},r.a.createElement(I.a,Object.assign({className:e.tab,label:"Models"},Ce(0))),r.a.createElement(I.a,Object.assign({className:e.tab,label:"Instances"},Ce(1))),r.a.createElement(I.a,Object.assign({className:e.tab,label:"Racks"},Ce(2))),r.a.createElement(I.a,Object.assign({className:e.tab,label:"Statistics"},Ce(2))),r.a.createElement(I.a,Object.assign({className:e.tab,label:"Users"},Ce(2))),r.a.createElement(c.a,{className:e.button,variant:"contained",color:"secondary",onClick:void 0},"Logout"))),r.a.createElement(Ee,{value:n,index:0},r.a.createElement(re,null)),r.a.createElement(Ee,{value:n,index:1},r.a.createElement(be,null)),r.a.createElement(Ee,{value:n,index:2},r.a.createElement(ve,null)),r.a.createElement(Ee,{value:n,index:3},r.a.createElement(fe,null)),r.a.createElement(Ee,{value:n,index:4},r.a.createElement(de,null)))}l.a.render(r.a.createElement((function(){return r.a.createElement(i.a,null,r.a.createElement(o.c,null,r.a.createElement(o.a,{path:"/"},r.a.createElement(ke,null)),r.a.createElement(o.a,{path:"/homepage"},r.a.createElement(C,null))))}),null),document.getElementById("root"))},97:function(e,t,a){e.exports=a(129)}},[[97,1,2]]]);
//# sourceMappingURL=main.8cdaee7e.chunk.js.map
