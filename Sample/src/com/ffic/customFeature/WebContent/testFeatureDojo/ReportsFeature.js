define([
	"dojo/_base/declare",
	"ecm/widget/layout/_LaunchBarPane",
	"dojo/text!./templates/ReportsFeature.html","ecm/model/Request", "dojo/_base/lang","dojox/grid/DataGrid","dojox/grid/enhanced/plugins/exporter/CSVWriter","dojox/grid/enhanced/plugins/Filter","dojox/grid/enhanced/plugins/Pagination"
],
function(declare,
		_LaunchBarPane,
		template,request,lang,datagrid,exporter,filter,pagination) {
	/**
	 * @name testFeatureDojo.ReportsFeature
	 * @class 
	 * @augments ecm.widget.layout._LaunchBarPane
	 */
	return declare("testFeatureDojo.ReportsFeature", [
		_LaunchBarPane
	], {
		/** @lends testFeatureDojo.ReportsFeature.prototype */

		templateString: template,
		
		// Set to true if widget template contains DOJO widgets.
		widgetsInTemplate: true,
		host:null,
		gridData:null,
		_downloadfileURL:null,
		ipaddress:null,
		hostname:null,
		hidecolumns:null,
		postCreate: function() {
			this.logEntry("postCreate");
			this.inherited(arguments);
			var params=new Object();
			params.fetchtype="all";
			this._invokeService(params);
			/**
			 * Add custom logic (if any) that should be necessary after the feature pane is created. For example,
			 * you might need to connect events to trigger the pane to update based on specific user actions.
			 */
			
			this.logExit("postCreate");
		},
		
		/**
		 * Optional method that sets additional parameters when the user clicks on the launch button associated with 
		 * this feature.
		 */
		setParams: function(params) {
			this.logEntry("setParams", params);
			
			if (params) {
				
				if (!this.isLoaded && this.selected) {
					this.loadContent();
				}
			}
			
			this.logExit("setParams");
		},

		/**
		 * Loads the content of the pane. This is a required method to insert a pane into the LaunchBarContainer.
		 */
		loadContent: function() {
			this.logEntry("loadContent");
			
			if (!this.isLoaded) {
				/**
				 * Add custom load logic here. The LaunchBarContainer widget will call this method when the user
				 * clicks on the launch button associated with this feature.
				 */
				this.isLoaded = true;
				this.needReset = false;
				//console.log("Inside the method loadContent",this);

			}
			
			this.logExit("loadContent");
		},

		/**
		 * Resets the content of this pane.
		 */
		reset: function() {
			this.logEntry("reset");
			
			/**
			 * This is an option method that allows you to force the LaunchBarContainer to reset when the user
			 * clicks on the launch button associated with this feature.
			 */
			this.needReset = false;
			
			this.logExit("reset");
		},
		
		
		
		
		_downloadData:function()
		{
			
			console.debug("inside download data method",this);
			
			
			
			if(this._downloadfileURL==null || this._downloadfileURL==undefined || this._downloadfileURL=="")
				{
				var s= ecm.widget.dialog.MessageDialog();
				s.setMessage("Unable to find any file. Make sure the path is valid.");
				s.setTitle("Error");
				s.show();
				}
			else
				{
				try {
					window.open(this._downloadfileURL,'_self');
				}
				catch(err) {
					//console.log("the error mesage",err.message);
					var s= ecm.widget.dialog.MessageDialog();
					s.setTitle="Error";
				  s.setMessage(err.message);
				  s.show();
				}
				
				
				}
			//file://///cxoce03/d$/isha/ATPReport/Reconciliation.csv
			
			
		},
		
	
		_constructGrid:function(resp)
		{
			console.debug("inside constructgrid",resp);
			var dataG=resp.items;
			//console.log("the actual data for grid is",dataG);
			
			
	
			var layout = [{field: "id", name:"#", get:this.siFormatter, filterable: false,"width": "auto"},{"name":"Server Name","field":"Server Name","width": "100px",autoComplete: true},{"name":"Utility Name", "field":"Utility Name", "width": "122px",autoComplete: true },{"name":"Project Name","field":"Project Name","width":"150px",autoComplete:true},
			              {"name":"Batch Name", "field":"Batch id", "width": "250px"},
			              {"name":"Start Time", "field":"Start Time", "width": "200px","filterable":false,"formatter":this.startFormatter,datatype:"date"},{"name":"End Time", "field":"End Time", "width": "200px","filterable":false,"formatter":this.startFormatter,datatype:"date"},{"name":"Total Time", "field":"Total Time", "width": "200px","filterable":false,datatype:"time","formatter":this.tFormatter},{"name":"Total Count", "field":"Total Count", "width": "70px","filterable":false,datatype:"number"},{"name":"Success Count", "field":"Success Count", "width": "80px","filterable":false},{"name":"Retry Success", "field":"Retry Success", "width": "50px","filterable":false},{"name":"Failure Count", "field":"Failure Count", "width": "50px","filterable":false},{"name":"Batch Execution Rate / Minute", "field":"Ingestion Rate", "width": "100px","filterable":false,"formatter":this.ingestionRate},{"name":"Error", "field":"Error Set", "width": "250px","filterable":false}];

			//,"formatter":this.startFormatter
	
			
			
		/* set up data store */

		var data = {

			identifier : "id",

			items :resp.items
		};

	
		var store = new dojo.data.ItemFileWriteStore({
			//typeMap:typeMap,
			data : data
		});
		

		this.hideColumns(layout);
		
		
		/* create a new grid: */
		this._grid =new dojox.grid.EnhancedGrid({
		//this._grid = new dojox.grid.DataGrid({,{attribute: 'col7', descending: true}

			structure : layout,
			store : store,
			noDataMessage: 'No data for this in Redis.',
			 //sortFields: [{attribute: 'Modified Date', descending: true}],
			//canSort: function(col) { return col != 1; },
			autoHeight:true,
			plugins:{
			    
			    filter: {
	                // Show the closeFilterbarButton at the filter bar
	                closeFilterbarButton: false,
	                // Set the maximum rule count to 5
	                ruleCount: 4,
	                ruleCountToConfirmClearFilter:Infinity,
	                // Set the name of the items
	                itemsName: "Reports"
	            },
	            exporter: true,
	            pagination: {
	                pageSizes: ["50", "100", "All"],
	                description: true,
	                /*one which shows the page size we can directly go*/
	                sizeSwitch: true,
	                pageStepper: true,
	                gotoButton: true,
	                        /*page step to be displayed*/
	                maxPageStep: 4,
	                        /*position of the pagination bar*/
	                position: "bottom",
	                defaultPageSize:50
	            },
	            //nestedSorting: false,
	            
	           

			  }
		
		},this._displayReportGrid);

		
			//console.log("Inside making the grid dispaly",this);
			
			//this._displayReportGrid.appendChild(this._grid.domNode);
			
			
		this._grid.startup();
		//this._grid.resize();
	//this.setcellsize();
		
		console.log("Grid populated successfully",this._grid);
			
			
			
			
		},
		
		hideColumns:function(layout)
		{
			console.debug("inside hideColumns and printing layout",layout);
			var colsTohide=this.hidecolumns;
			//hiding the columns using their field name that we got from the config file before grid loads
			if(colsTohide.length!=0)
				{
			for(var index=0;index<colsTohide.length;index++)
				{
				var col=""+colsTohide[index]+"";
				//console.log("the column is",col);
				for(var l=0;l<layout.length;l++)
					{
						var colname=layout[l];
						if(colname.field==col)
							{
							console.debug("the matching column to be hidden",colname);
							colname.hidden=true;
							}
					}
				}
				}
			
			
			
			
		},
		 siFormatter:function (index)
			{
			 //console.log("inside si function",this);
			 
			 //var s=this.grid.getTotalRowCount();
			 //var pno=this.grid.getTotalPageNum();
			 var currentpno=this.grid.currentPage();
			 var pagesize=this.grid.currentPageSize();
			 console.debug("inside siformatter:",currentpno);
			 return pagesize*(currentpno-1)+index+1;
			
			},
			
			startFormatter:function(datum)
			{
				//console.log("inside startformatter",value);
				try{
				//console.log("formatDate:",datum);
		        // Format the value in store, so as to be displayed.
		        if(datum!=null && datum!=""){
		        	var aNewDate = dojo.date.locale.parse(datum, {datePattern: "MM/dd/yyyy hh:mm:ss a",selector:"date"});
		        	//console.debug("the new date parsed is",aNewDate);
		        	//var d = dojo.date.stamp.fromISOString(datum);
		        	//console.log("the time stamp",d);
		        	return dojo.date.locale.format(aNewDate, {selector:"date", datePattern: "EEE MMM dd yyyy HH:mm:ss"});
		        	//return dojo.date.locale.format(d, {selector: "date", formatLength: "short"});
		        }else{
		        	return "";
		        }
				}
				catch(err)
				{
					console.debug("exception while converting date format",err);
				}
				 
				
				
			},
			
			tFormatter:function(millisec)
			{
				
			    console.debug("inside time formatter",millisec);  
			    var d=new Date(millisec);
			    
			    
			    //var hours = d.getHours();
		        
			    var minutes = d.getMinutes();
		        
				var seconds =d.getSeconds(); 

			

			      var hours = (millisec / (1000 * 60 * 60));
			      
			      var h=parseInt(hours,10);
			       // var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
			        return h+"hrs "+minutes+"min "+seconds+"sec";
			    
			},
			
			ingestionRate:function(value)
			{
				
				
				if (value % 1 == 0) {
					if(value!=null && value!="")
						return value+".0";
					else
						return "0.0";
				} else {
				    return value;
				}
			},
			
			
		/*setcellsize:function()
		{
			console.log("inside the settcellsize",this);
			var grid=this._grid;
			//var pagesize=this._grid.viewsHeaderNode.clientWidth;
			//pagesize=pagesize+"px";
			//console.log("the page size is",pagesize);
			//var node=this._grid.viewsNode.children[0].querySelectorAll(".dojoxGridRowTable");
			//console.log("the node array is",node);
			
		
			var desktopid=ecm.model.desktop.id;
			
			console.log("the desktop id is",desktopid);
			//console.log("the grid object resized",grid);
			if("Dashboard"==desktopid)
				{
			for(var i=0;i<node.length;i++)
			{
				node[i].style.width=pagesize;
				//console.log("the html",node[i].style.width);
				}
			
				
			//For making the cell constant of 100px for all the headers
			dojo.forEach(this._grid.layout.cells,function(cell,idx){
				console.log("inside the for loop",cell);
				grid.setCellWidth(idx,cell.unitWidth);
				cell.view.update();
			});
			//grid.update();
			
			
			this._grid.views.updateRowStyles();
			this._grid.update();
				}
		
		},*/
		/*
		_exportData:function()
		{
			var data=null;
			var fdata=null;
			this._grid.exportGrid("csv",function(str){
				
				console.log("Inside the export function",this);
				 data=str;
				
				
			});
			console.log("after getting the data",data);
			
			//console.log("after the click is clicked",fdata);
//For IE browser
			var blob =new Blob([data],{type:"text/csv;charset=utf-8;"});
			navigator.msSaveBlob(blob,"Report.csv");
			
		},*/
		
			
		
		
		//Method to call Redis Database and populate it
		_getData:function()
		{
			
			//console.log("Iniside get Data Method",this);
			
			//dojo.style(this._sReoprt.domNode,"display","none");
			
			//this._sReoprt.hidden=true;
			var params=new Object();
			params.fetchtype="all";
			this._invokeService(params);
			
			
		},
		

		_invokeService:function(params)
		{
			
				
			request.invokePluginService("TestFeature","FeatureService",{
				requestParams:params,
				requestCompleteCallback:lang.hitch(this,function(response){
					console.debug("inside response block",response);
					if("all"==params.fetchtype)
						{
					this.gridData=response.items;
					this._downloadfileURL=response.downloadlocation;
					this.ipaddress=response.ipaddress;
					this.hostname=response.hostname;
					this.hidecolumns=response.hidecolumns;
					console.debug("the ip address",this.ipaddress);
					console.debug("the host name",this.hostname);
					console.debug("the columns to be hidden is",this.hidecolumns);
					if(this.ipaddress==undefined || this.hostname == undefined)
						{
						//var s= ecm.widget.dialog.MessageDialog();
						//s.setTitle("Error");
						var server="Unable to connect to Redis. Make sure your Redis is up and running.";
						//console.log("the server is",server);
						this._connectedServer.innerHTML=server.bold();
						//s.setMessage("Unable to connect to Redis. Make sure your Redis is up and running.");
						//s.show();
						
						}
					else
						{
						var server="Connected to  Redis at "+this.hostname+" "+"("+this.ipaddress+")";
						//console.log("the server is",server);
						this._connectedServer.innerHTML=server.bold();
						
						}
					
				//	console.debug("the Grid Data is",this.gridData);
					
					console.debug("the griddata object is",this.gridData);
					console.debug("the downloadfile url is",this._downloadfileURL);
					this._constructGrid(response);
						}
					
					/*else if("download"==params.fetchtype)
						{
							console.log("inside the service response of download",response.status);
						
						}*/
					
					
				}),
				requestFailedCallback:function(ex)
				{
					console.debug("inside Exception block",ex);
					var server="Unable to connect to Redis. Make sure your Redis is up and running.";
					this._connectedServer.innerHTML=server.bold();
					//var s= ecm.widget.dialog.MessageDialog();
					//s.setTitle("Error");
					//s.setMessage("Unable to connect to Redis. Make sure your Redis is up and running.");
					//s.show();
					
				}
				
			});
		
			
			
			
			
		}
		
		
	});
});
