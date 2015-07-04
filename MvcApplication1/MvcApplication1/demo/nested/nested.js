//var app = angular.module("demo").controller("NestedListsDemoController", function($scope) {
var app = angular.module('app', ['ngSanitize', 'json-tree']);

app.controller("NestedListsDemoController", function($scope, $sce) {
	$scope.trustAsHtml = function(string) {
		return $sce.trustAsHtml(string);
	};

	$scope.keyPressed = function(e) {

		if (e.which == 13) {
			$scope.renderAll();
		}
	};

	$scope.findElement = function (e) {
	    var id = e.target.id;
	    if (id != undefined && id != null && id != "") {
	        var el = _.find($scope.models.dropzones["dz1"].items, function (num) {
	            return num.id == id;
	        });

	        if (el != undefined)
	        {

	        }
	    }


	};
	

	$scope.saveJson = function() {
		$.ajax({ //58372  MvcRESTApplication
			url: "/Forms/SaveJson",
			type: 'POST',
			data: {
				formName: $scope.models.dropzones["dz1"].form.name,
				json: JSON.stringify($scope.models.dropzones["dz1"])
			},
			cache: false,
			success: function(val) {},
			error: function(xhr, textStatus, errorThrown) {
				//alert('request failed');
				console.log(textStatus);
			}
		});
	}

	$scope.forms = [];
	$scope.formID = 0;
	$scope.getForms = function() {
		$.ajax({ //58372  MvcRESTApplication
			url: "/Forms/GetForms",
			type: 'GET',
			cache: false,
			success: function(val) {

				$scope.$apply(function() {
					var fff = JSON.parse(val);
					for (var i = 0; i < fff.length; i++) {
						$scope.forms.push({
							ID: fff[i].ID,
							FormName: fff[i].FormName
						});
					}

				});
			},
			error: function(xhr, textStatus, errorThrown) {
				//alert('request failed');
				console.log(textStatus);
			}
		});
	}


	$scope.frm = {
		formID: 0
	}

	$scope.$watch('frm.formID', function(model) {
		if (!model)
			return;
		if (model == 0)
			return;
		$.ajax({ //58372  MvcRESTApplication
			url: "/Forms/GetFormById",
			type: 'POST',
			data: {
				id: model
			},
			cache: false,
			success: function(val) {
				var fff = JSON.parse(val);
				var items = JSON.parse(fff.json);

				$scope.$apply(function() {
					//$scope.models.dropzones["dz1"] = items;
					$scope.models.dropzones["dz1"].load(items);
				});
			},
			error: function(xhr, textStatus, errorThrown) {
				//alert('request failed');
				console.log(textStatus);
			}
		});
	}, true);



	var hasValue = function(val) {
		var rez = true;
		if (val == undefined || val == null || val == "")
			rez = false;
		return rez;
	}
	var customGuid = function() {
		function _p8(s) {
			var p = (Math.random().toString(16) + "000000000").substr(2, 8);
			return p.substr(0, 4);
		}
		return _p8(true);
	};
	var realMerge = function(to, from) {
		for (n in from) {
			if (typeof to[n] != 'object') {
				to[n] = from[n];
			} else if (typeof from[n] == 'object') {
				to[n] = realMerge(to[n], from[n]);
			}
		}

		return to;
	};
	var CssValues = function() {
		this.css = "";
		this.items = [];
		this.addItem = function(val) {
			if (this.items == undefined) {
				return;
			}
			var it = {
				useThis: false,
				css: val
			};
			this.items.push(it);
			return it;
		}

		this.getCss = function() {
			if (this.css == undefined)
				return "";
			var rez = this.css;
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].useThis) {
					rez = rez + " " + this.items[i].css;
				}
			}
			return rez;
		}
	};

	var validation = function() {

		this.items = [];
		this.addItem = function(directive, message, model, directiveValue) {
			if (this.items == undefined) {
				return;
			}
			this.items.push({
				use: false,
				directive: directive,
				directiveValue: directiveValue,
				message: {
					message: message,
					model: model
				}
			});

		}

		this.addItem("required", "required", "");
		this.addItem("number", "Type a numeric value", "");
		this.addItem("maxLength", "Max length", "", 10);

		var ctrlName = "";
		this.setControlName = function(ctrlNameValue) {
			ctrlName = ctrlNameValue;
		};
		this.getControlName = function() {
			return ctrlName;
		};

		this.sameLine = false;
		this.render = function() {
		    var rez = "";
		    var css = "error ";
		    if (this.sameLine)
		    {
		        css += "col-sm-3";
		    }
			for (var i = 0; i < this.items.length; i++) {
				var it = this.items[i];
				if (it.use == false)
					continue;

				var frm = $scope.models.dropzones["dz1"].form.name;
				rez = rez + "<span ng-show=\"" + frm + "." + this.getControlName() + ".$error." + it.directive;
				rez += " && !" + frm + ".$pristine" + "\"" + " class=" + "\"" + css + "\"" + ">";
				if (hasValue(it.message.message)) {
					rez += it.message.message + "</span>" + "\n";
				} else {
					rez += it.message.model + "</span>" + "\n";
				}

			}
			return rez;
		}

		this.renderValidationDirectives = function() {
			var rez = " ";
			for (var i = 0; i < this.items.length; i++) {
				var it = this.items[i];
				if (it.use == false)
					continue;

				if (hasValue(it.directiveValue)) {
					//rez = rez +  it.directive +  "<span ng-show=\"" + $scope.dz1.form.name +"."+  ctrlName  + "$error."+ it.directive  +  "\"" + ">" + it.message + "</span>" + "\n";	
				} else {
					rez = rez + it.directive + " ";
				}

			}
			return rez;
		}
	};

	var label = function() {
		this.type = "lbl";
		this.name = "";
		this.cssValues = new CssValues();
		this.cssValues.addItem("control-label");
		this.cssValues.addItem("col-sm-1");
		this.cssValues.addItem("col-sm-2");
		this.cssValues.addItem("col-sm-3");

		this.id = "";
		this.model = "";
		this.value = "";
		this.labelFor = "";
		this.sameLine = false;
		var isComplex = false;
		this.index = 0;
		this.group = 0;
		this.isComplex = function(val) {
			isComplex = val;
		}

		this.mustRender = function() {
			var rez = false;
			if (hasValue(this.value) || hasValue(this.model)) {
				rez = true;
			}
			return rez;
		}
		var rendered = false;
		this.setRenderToFalse = function () {
		    rendered = false;
		}
		this.isRendered = function () {
		    return rendered;
		}
		this.render = function() {
		    var rez = "";
		    if (rendered)
		        return rez;
			if (this.value == "" && this.model == "")
				return rez;
			var css = "";

			if (this.sameLine) {
			    this.cssValues.css = "col-sm-1";
			} else {
				if (isComplex) {
				    //rez += "<div class=\"row\">" + "\n";
				    rez += "<div class=\"col-xs-3 row\"><!--lbl-->" + "\n";
				} else {
				    rez += "<div>" + "<!--lbl1-->" + "\n";
				}
			}
			rez += "<label ";

			if (this.labelFor != "") {
				rez = rez + " for=\"" + this.labelFor + "\"";
			}

			if (this.id != "") {
				rez = rez + " id=\"" + this.id + "\"";
			}

			if (this.name != "") {
				rez = rez + " name=\"" + this.name + "\"";
			}

			//use underscore to read the selected classes
			//var 
			if (this.cssValues != undefined) {
				var css = this.cssValues.getCss();

				if (css != "") {
					rez = rez + " class=\"" + css + "\"";
				}
			}



			if (this.model != "") {
				rez = rez + " ng-model=\"" + this.model + "\"" + "></label>" + '\n';
			} else {
				if (this.value != "") {
					rez = rez + ">" + this.value + "</label>" + '\n';
				} else {
					rez = rez + ">" + "</label>" + '\n';
				}
			}

			if (this.sameLine) {} else {
			    if (isComplex) {
			        rez += "</div>" + "<!--lbl-->" + "\n";
			        //rez += "</div>" + "\n";
			    } else {
			        rez += "</div>" + "<!--lbl1-->" + "\n";
			    }
			}
			rendered = true;
			return rez;
		}
	};

	var text = function() {
		this.type = "text";
		this.name = "";
		this.id = "";

		this.model = "";
		this.value = "";
		this.cssValues = new CssValues();
		var frmControl = this.cssValues.addItem("form-control");
		this.cssValues.addItem("col-sm-1");
		this.cssValues.addItem("col-sm-2");
		this.cssValues.addItem("col-sm-3");
		this.cssValues.css = "form-control";

		this.placeholder = "";
		//this.controlGroup = false;
		this.group = 0;
		this.index = 0;
		this.validation = new validation();
		this.label = new label();

		this.glyph = new glyph();

		this.isComplex = function() {
			var rez = false;
			if (this.glyph.mustRender() || this.validation.sameLine) {
				rez = true;
			}
			return rez;
		}

		this.controlType =
			[{
					mode: "text",
					use: true
				}, {
					mode: "email",
					use: false
				}, {
					mode: "number",
					use: false
				}, {
					mode: "password",
					use: false
				}

			];

		var rendered = false;
		this.setRenderToFalse = function()
		{
		    rendered = false;
		}
		this.isRendered = function () {
		    return rendered;
		}
		this.renderInput = function() {
				var rez = "";
				var renderGlyph = this.glyph.mustRender();
				var renderLabel = this.label.mustRender();
				frmControl.useThis = true;
				//if (renderGlyph) {
					
				//} else {
				//	frmControl.useThis = false;
				//}
				if (renderLabel) {
					if (this.id == "") {
						this.id = customGuid();
					}
					this.label.labelFor = this.id;
					rez = rez + this.label.render();
				}
				var needContainer = (renderLabel && this.label.sameLine)||(this.validation.sameLine)
				if (needContainer) {
				    var divCSs = "col-sm-3 ";
				    if (this.group > 0) {
				        if (this.label.sameLine) {
				            divCSs = "col-sm-9 ";
				        } else {
				            divCSs = "col-sm-12 ";
				        }
				    }
					if (renderGlyph) {
					    divCSs += "input-group";
					} else {
					    divCSs += "row";
					}
					rez += "<div class=\"" + divCSs + "\"" + ">" + "<!-- container -->" + "\n";
				}
				else {
				    var divCSs = "col-sm-3 ";
				    if (this.group > 0) {
				        if (this.label.sameLine) {
				            divCSs = "col-sm-9 ";
				        } else {
				            divCSs = "col-sm-12 ";
				        }
				    }
				    if (this.label.sameLine==false)
				    {
				        divCSs += " row ";
				    }
				    if (renderGlyph) {
				        divCSs += "input-group";
				    }
				    rez += "<div class=\"" + divCSs + "\"" + ">" + "<!-- container1 -->" + "\n";
				}
				var type = _.find(this.controlType, function(num) {
					return num.use
				});

				//if (this.isComplex()) {

				//    rez += "<div class=\"col-sm-3 input-group\"><!-- input reg -->"; +"\n";
				//}
				rez = rez + "\n" +  "<input type=\"" + type.mode + "\"";

				if (hasValue(this.id)) {
					rez = rez + " id=\"" + this.id + "\"";
				}

				var hasValidation = _.find(this.validation.items, function(num) {
					return num.use
				});
				if (hasValidation) {
					if (hasValue(this.name) == false) {
						if (hasValue(this.id) == false) {
							this.name = customGuid();
						} else {
							this.name = this.id;
						}
					}
					this.validation.setControlName(this.name);
				}

				if (hasValue(this.name)) {
					rez = rez + " name=\"" + this.name + "\"";
				}

				var css = this.cssValues.getCss();
				rez = rez + " class=\"" + css + "\"";

				if (this.placeholder != "") {
					rez = rez + " placeholder=\"" + this.placeholder + "\"";
				}

				if (this.model != "") {
					rez = rez + " ng-model=\"" + this.model + "\"";
				} else {
					if (this.value != "") {
						rez = rez + " value=\"" + this.value + "\"";
					}
				}
				rez += this.validation.renderValidationDirectives();

				rez = rez + "/>" + '\n';

				if (renderGlyph) {
				    rez += "<span class=\"input-group-addon input-group-addon-remove\">" + "\n";
					//rez += "            <button class=\"btn btn-success btn-add\" type=\"button\">" + "\n";
					rez += "                <span class=\"glyphicon " + this.glyph.css + "\"" + "></span>" + "\n";
					//rez += "            </button>" + "\n";
					rez += "        </span>" + "\n";
					//rez += "        </div>" +"<!--g1-->"+ "\n";
					//rez += "        </div>" +"<!--g0-->"+ "\n";
				}
				if (this.validation.sameLine == false) {
				    rez += this.validation.render();
				}

				if (needContainer) {
				    rez += "</div>" + "<!--container-->" + "\n";
				} else {
				    rez += "</div>" + "<!--container1-->" + "\n";
				}
				
				if (this.validation.sameLine) {

				    rez += "<div class=\"col-sm-3 \">" + "<!-- validation -->"; +"\n";

				    rez += this.validation.render();
				    rez += "</div>" +"<!-- validation -->"; +"\n";
				}
                
				//if (renderGlyph) {
				//    if (renderLabel && this.label.sameLine == false) {
				//        rez += "</div>" + "\n";
				//    }
				//}


				return rez;
			}
			//this.renderControlGroup = function() {
			//	var rez = "";
			//	rez = rez + "<div class=\"control-group\">" + "\n";
			//	rez += this.renderInput();
			//	rez += "</div>" + "\n";
			//	return rez;
			//};

		this.renderFormGroup = function() {
			//this.label.isComplex(this.isComplex());
			var rez = "";
			rez = rez + "<div class=\"form-group clearfix\">" + "\n";

			rez += this.renderInput();

			rez = rez + "</div>" + "<!--form-group-->" + "\n";
			return rez;
		}

		this.render = function() {
		    if(rendered)
		        return "";

		    rendered = true;
			return this.renderFormGroup();
		}
	};

	var checkbox = function () {
	    this.type = "checkbox";
	    this.name = "";
	    this.id = "";

	    this.model = "";
	    this.value = "";
	    this.cssValues = new CssValues();
	    this.cssValues.addItem("col-sm-1");
	    this.cssValues.addItem("col-sm-2");
	    this.cssValues.addItem("col-sm-3");

	    this.placeholder = "";
	    //this.controlGroup = false;
	    this.group = 0;
	    this.index = 0;
	    this.validation = new validation();
	    this.label = new label();


	    this.isComplex = function () {
	        var rez = false;
	        if (this.validation.sameLine) {
	            rez = true;
	        }
	        return rez;
	    }

	   

	    var rendered = false;
	    this.setRenderToFalse = function () {
	        rendered = false;
	    }
	    this.isRendered = function () {
	        return rendered;
	    }
	    this.renderChk = function () {
	        var rez = "";
	        var renderLabel = this.label.mustRender();
	        //if (renderGlyph) {

	        //} else {
	        //	frmControl.useThis = false;
	        //}
	        if (renderLabel) {
	            if (this.id == "") {
	                this.id = customGuid();
	            }
	            this.label.labelFor = this.id;
	            rez = rez + this.label.render();
	        }
	        
	        var type = "checkbox"

	        //if (this.isComplex()) {

	        //    rez += "<div class=\"col-sm-3 input-group\"><!-- input reg -->"; +"\n";
	        //}
	        rez = rez + "\n" + "<input type=\"" + type + "\"";

	        if (hasValue(this.id)) {
	            rez = rez + " id=\"" + this.id + "\"";
	        }

	        var hasValidation = _.find(this.validation.items, function (num) {
	            return num.use
	        });
	        if (hasValidation) {
	            if (hasValue(this.name) == false) {
	                if (hasValue(this.id) == false) {
	                    this.name = customGuid();
	                } else {
	                    this.name = this.id;
	                }
	            }
	            this.validation.setControlName(this.name);
	        }

	        if (hasValue(this.name)) {
	            rez = rez + " name=\"" + this.name + "\"";
	        }

	        var css = this.cssValues.getCss();
	        rez = rez + " class=\"" + css + "\"";

	        if (this.placeholder != "") {
	            rez = rez + " placeholder=\"" + this.placeholder + "\"";
	        }

	        if (this.model != "") {
	            rez = rez + " ng-model=\"" + this.model + "\"";
	        } else {
	            if (this.value != "") {
	                rez = rez + " value=\"" + this.value + "\"";
	            }
	        }
	        rez += this.validation.renderValidationDirectives();

	        rez = rez + "/>" + '\n';

	       
	        if (this.validation.sameLine == false) {
	            rez += this.validation.render();
	        }

	       

	        if (this.validation.sameLine) {

	            rez += "<div class=\"col-sm-3 \">" + "<!-- validation -->"; +"\n";

	            rez += this.validation.render();
	            rez += "</div>" + "<!-- validation -->"; +"\n";
	        }

	        //if (renderGlyph) {
	        //    if (renderLabel && this.label.sameLine == false) {
	        //        rez += "</div>" + "\n";
	        //    }
	        //}


	        return rez;
	    }
	    //this.renderControlGroup = function() {
	    //	var rez = "";
	    //	rez = rez + "<div class=\"control-group\">" + "\n";
	    //	rez += this.renderInput();
	    //	rez += "</div>" + "\n";
	    //	return rez;
	    //};

	    this.renderFormGroup = function () {
	        //this.label.isComplex(this.isComplex());
	        var rez = "";
	        rez = rez + "<div class=\"form-group clearfix\">" + "\n";

	        rez += this.renderChk();

	        rez = rez + "</div>" + "<!--form-group-->" + "\n";
	        return rez;
	    }

	    this.render = function () {
	        if (rendered)
	            return "";

	        rendered = true;
	        return this.renderFormGroup();
	    }
	};

	var glyph = function() {
		this.type = "glyph";
		this.model = "";
		this.value = "";
		this.css = "";

		this.mustRender = function() {
			var rez = false;
			if (hasValue(this.css) || hasValue(this.model)) {
				rez = true;
			}
			return rez;
		}
		this.render = function() {
			var rez = " <span class=\"glyphicon ";
			rez += this.cssValues;
			if (this.model != "") {
				rez += "{{" + this.model + "}}";
			} else {
				rez = rez + "\"";

			}
			return rez;
		}
	};

	var button = function() {
		this.type = "button";
		this.name = "";
		this.id = "";
		this.required = false;
		this.model = "";
		this.value = "";
		this.css = "";
		this.placeholder = "";
		this.controlGroup = false;
		this.formGroup = true;

		this.label = new label();


		this.cssValues = new CssValues();
		this.cssValues.addItem("control-label");
		this.cssValues.addItem("col-sm-1");
		this.cssValues.addItem("col-sm-2");
		this.cssValues.addItem("col-sm-3");


		this.render = function() {
			var rez = "";
			rez = rez + "<div class=\"form-group\">" + "\n";
			if (this.label) {
				if (this.id == "") {
					this.id = customGuid();
				}
				this.label.labelFor = this.id;
				rez = rez + this.label.render();
			}
			rez = rez + "<input type=\"text\"";

			if (this.id != "") {
				rez = rez + " id=\"" + this.id + "\"";
			}

			if (this.name != "") {
				rez = rez + " name=\"" + this.name + "\"";
			}

			if (this.css != "") {
				rez = rez + " class=\"" + this.css + "\"";
			}

			if (this.placeholder != "") {
				rez = rez + " placeholder=\"" + this.placeholder + "\"";
			}

			if (this.model != "") {
				rez = rez + " ng-model=\"" + this.model + "\"";
			} else {
				if (this.value != "") {
					rez = rez + " value=\"" + this.value + "\"";
				}
			}

			rez = rez + "/>" + '\n';

			rez = rez + "</div>" + "\n"
			return rez;
		}

		this.render = function() {


			return this.render();
		}
	};


	$scope.renderAll = function() {
		$scope.models.htmlv = $scope.models.dropzones["dz1"].render();
	}
	//form - horizontal
	$scope.models = {
		selected: null,
		htmlv: "",
		templates: [],
		dropzones: {
			dz1: {
				form: {
					name: "",
					css: "",
					renderStart: function() {
						if (!hasValue(this.name)) {
							this.name = customGuid();
						}
						var rez = "<div class=\"container\">" + '\n';
						rez += "   <div class=\"panel panel-default\">" + '\n';
						rez += "       <div class=\"panel-body\">" + '\n';

						rez += "            <ng-form name=" + this.name + "\"" + " class=\"" + this.css + "\"" + " novalidate>" + '\n';

						return rez;
					},

					renderEnd: function() {
						var rez = "";
						rez += "            </ng-form>" + '\n';
						rez += "        </div>" + '\n';
						rez += "</div>" + '\n';
						rez += "</div>" + '\n';

						return rez;
					},
					load: function(obj) {
					    this.name = obj.name;
					    this.css = obj.css;
					}
				},
				items: [],
				add: function(obj) {
					if (obj == null || obj == "")
						return null;

					var toAdd = null;
					switch (obj.type) {
						case "text":
							{
								toAdd = new text();
								break;
							}
						case "checkbox":
							{
								toAdd = new checkbox();
								break;
							}
					    case "lbl":
					        {
					            toAdd = new label();
					            break;
					        }
					}

					//$scope.$apply(function() {
					//$scope.models.htmlv = $scope.models.dropzones["dz1"].render();
					//}); 
					return toAdd;
				},
				load: function(obj) {
					if (obj == null || obj == "")
						return;
					var v = $scope.models.dropzones["dz1"];
					v.items = [];
					v.form.load(obj.form);

					for (var i = 0; i < obj.items.length; i++) {
						var dbObj = obj.items[i];
						var it = v.add(dbObj);
						var merged = realMerge(it, dbObj);

						v.items.push(merged);
					}
					$scope.models.htmlv = v.render();
				},
				render: function() {
					var model = $scope.models.dropzones["dz1"];
					var rez = model.form.renderStart();

					var orderedItems = _.sortBy(model.items, 'index');

					for (var i = 0; i < orderedItems.length; i++)
					    {
					    var itt = orderedItems[i];
					        itt.setRenderToFalse();
					    }
					for (var i = 0; i < orderedItems.length; i++) {
					    var itt = orderedItems[i];
					    if (itt.group > 0) {
					        var groupItems = _.filter(orderedItems, function (num) {
					            return num.group == itt.group;
					        });
					        var forCss = [];
					        switch (groupItems.length)
					        {
					            case 1:
					                {
					                    forCss.push(12);
					                    break;
					                }
					            case 2:
					                {
					                    forCss.push(6);
					                    forCss.push(6);
					                    break;
					                }
					            case 3:
					                {
					                    forCss.push(4);
					                    forCss.push(4);
					                    forCss.push(4);
					                    break;
					                }
					            case 4:
					                {
					                    forCss.push(3);
					                    forCss.push(3);
					                    forCss.push(3);
					                    forCss.push(3);
					                    break;
					                }
					            case 5:
					                {
					                    forCss.push(4);
					                    forCss.push(4);
					                    forCss.push(2);
					                    forCss.push(2);
					                    forCss.push(2);
					                    break;
					                }
					            case 6:
					                {
					                    forCss.push(2);
					                    forCss.push(2);
					                    forCss.push(2);
					                    forCss.push(2);
					                    forCss.push(2);
					                    forCss.push(2);
					                    break;
					                }
					        }
					        var classValue = "col-xs-";

					        for (var x = 0; x < groupItems.length; x++)
					        {
					            var pc = classValue + forCss[x];
					            rez += "<div class =\"" + pc + "\"" + ">" + "\n";
                                rez += groupItems[x].render();
                                rez += "</div>";
					        }
					    } else {
					        rez = rez + itt.render();
					    }
					}

					rez = rez + model.form.renderEnd();

					return rez;
				}
			}
		}

	};

	$scope.models.templates.push(new text());
	$scope.models.templates.push(new label());
	$scope.models.templates.push(new checkbox());

	$scope.jsObj = null;
	$scope.$watch('models.dropzones', function(model) {
		$scope.modelAsJson = angular.toJson(model, true);
		$scope.jsObj = model;
	}, true);



	$scope.addControl = function(it) {
		var v = $scope.models.dropzones["dz1"];
		var newObj = v.add(it);
		v.items.push(newObj);

		$scope.models.htmlv = v.render();
	}
	$scope.getForms();
});

app.directive('htmlRender', function($compile) {
		return {

			scope: {
				html: '@'
			},
			link: function(scope, element) {
				scope.$watch('html', function(value) {
					//value = "<label>af</label>";
					if (!value) return;

					var markup = $compile(value)(scope);
					element.append(markup);
					//element.replaceWith(markup);



					// element[0].innerHtml = value;
					// $compile(element.contents())(scope);

					//element.replaceWith(markup);


					// element[0].outerHTML =value;
					//
				});
			}
		};
	})
	.filter('to_trusted', ['$sce', function($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.directive('shortcut', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			link: function postLink(scope, iElement, iAttrs) {
				jQuery(document).on('keypress', function(e) {
					scope.$apply(scope.keyPressed(e));
				});
				jQuery(document).on('click', function (e) {
				    scope.$apply(scope.findElement(e));
				    //debugger;
				    //alert("a");
				    //scope.$apply(scope.keyPressed(e));
				});
				
			}
		};
	})
	.directive('prism', function($timeout, $parse) {
		return {
		    restrict: 'A',
		    scope: {
		        content: "="
		    },
			link: function(scope, element, attrs) {
				scope.$watch("content", function (newValue, oldValue) {
					if (newValue) {
						$timeout(function() {
						    Prism.highlightElement(element[0]);
						}, 10);
					}
				});
			}
		}
	})
.directive('nagPrism', [function() {
    return {
        restrict: 'A',
        scope: {
            source: '@'
        },
        link: function(scope, element, attrs) {
            scope.$watch('source', function(v) {
                if(v) {
                    Prism.highlightElement(element.find("code")[0]);
                }
            });
        },
        template: "<code ng-bind='source'></code>"
    };
}])
.directive('ngModelOnblur', function() {
		// override the default input to update on blur
		// from http://jsfiddle.net/cn8VF/
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elm, attr, ngModelCtrl) {
				if (attr.type === 'radio' || attr.type === 'checkbox') return;

				elm.unbind('input').unbind('keydown').unbind('change');
				elm.bind('blur', function() {
					scope.$apply(function() {
						ngModelCtrl.$setViewValue(elm.val());
					});
				});
			}
		};
	})
	.directive('json', ["$compile", function($compile) {
		return {
			restrict: 'E',
			scope: {
				child: '=',
				type: '@',
				defaultCollapsed: '='
			},
			link: function(scope, element, attributes) {
				var stringName = "Text";
				var objectName = "Object";
				var arrayName = "Array";
				var refName = "Reference";
				var boolName = "Boolean"

				scope.valueTypes = [stringName, objectName, arrayName, refName, boolName];
				scope.sortableOptions = {
					axis: 'y'
				};
				if (scope.$parent.defaultCollapsed === undefined) {
					scope.collapsed = false;
				} else {
					scope.collapsed = scope.defaultCollapsed;
				}
				if (scope.collapsed) {
					scope.chevron = "glyphicon-chevron-right";
				} else {
					scope.chevron = "glyphicon-chevron-down";
				}


				//////
				// Helper functions
				//////

				var getType = function(obj) {
					var mt = typeof(obj);
					var type = Object.prototype.toString.call(obj);
					if (type === "[object Object]") {
						return "Object";
					} else if (type === "[object Array]") {
						return "Array";
					} else if (type === "[object Boolean]") {
						return "Boolean";
					} else {
						if (type == "[object Function]") {
							return "Function";
						} else {
							return "Literal1" + type + mt;
						}
					}
				};
				var isNumber = function(n) {
					return !isNaN(parseFloat(n)) && isFinite(n);
				};
				scope.getType = function(obj) {
					//var rez = getType(obj);
					var rez = typeof(obj);
					console.log(rez);
					return rez;
				};
				scope.toggleCollapse = function() {
					if (scope.collapsed) {
						scope.collapsed = false;
						scope.chevron = "glyphicon-chevron-down";
					} else {
						scope.collapsed = true;
						scope.chevron = "glyphicon-chevron-right";
					}
				};
				scope.moveKey = function(obj, key, newkey) {
					//moves key to newkey in obj
					if (key !== newkey) {
						obj[newkey] = obj[key];
						delete obj[key];
					}
				};
				scope.deleteKey = function(obj, key) {
					if (getType(obj) == "Object") {
						if (confirm('Delete "' + key + '" and all it contains?')) {
							delete obj[key];
						}
					} else if (getType(obj) == "Array") {
						if (confirm('Delete "' + obj[key] + '"?')) {
							obj.splice(key, 1);
						}
					} else {
						console.error("object to delete from was " + obj);
					}
				};
				scope.addItem = function(obj) {
					if (getType(obj) == "Object") {
						// check input for key
						if (scope.keyName == undefined || scope.keyName.length == 0) {
							alert("Please fill in a name");
						} else if (scope.keyName.indexOf("$") == 0) {
							alert("The name may not start with $ (the dollar sign)");
						} else if (scope.keyName.indexOf("_") == 0) {
							alert("The name may not start with _ (the underscore)");
						} else {
							if (obj[scope.keyName]) {
								if (!confirm('An item with the name "' + scope.keyName + '" exists already. Do you really want to replace it?')) {
									return;
								}
							}
							// add item to object
							switch (scope.valueType) {
								case stringName:
									obj[scope.keyName] = scope.valueName ? scope.possibleNumber(scope.valueName) : "";
									break;
								case objectName:
									obj[scope.keyName] = {};
									break;
								case arrayName:
									obj[scope.keyName] = [];
									break;
								case refName:
									obj[scope.keyName] = {
										"Reference!!!!": "todo"
									};
									break;
								case boolName:
									obj[scope.keyName] = false;
									break;
							}
							//clean-up
							scope.keyName = "";
							scope.valueName = "";
							scope.showAddKey = false;
						}
					} else if (getType(obj) == "Array") {
						// add item to array
						switch (scope.valueType) {
							case stringName:
								obj.push(scope.valueName ? scope.valueName : "");
								break;
							case objectName:
								obj.push({});
								break;
							case arrayName:
								obj.push([]);
								break;
							case boolName:
								obj.push(false);
								break;
							case refName:
								obj.push({
									"Reference!!!!": "todo"
								});
								break;
						}
						scope.valueName = "";
						scope.showAddKey = false;
					} else {
						console.error("object to add to was " + obj);
					}
				};
				scope.possibleNumber = function(val) {
					return isNumber(val) ? parseFloat(val) : val;
				};

				//////
				// Template Generation
				//////

				// Note:
				// sometimes having a different ng-model and then saving it on ng-change
				// into the object or array is necessary for all updates to work

				// recursion
				var switchTemplate =
					'<span ng-switch on="getType(val)" >' +
					'<json ng-switch-when="Object" child="val" type="object" default-collapsed="defaultCollapsed"></json>' +
					'<json ng-switch-when="Array" child="val" type="array" default-collapsed="defaultCollapsed"></json>' +
					'<json ng-switch-when="Function" >ddd</json>' +
					'<span ng-switch-when="Boolean" type="boolean">' + '<input type="checkbox" ng-model="val" ng-model-onblur ng-change="child[key] = val">' + '</span>' +
					'<span ng-switch-default class="jsonLiteral"><input type="text" ng-model="val" ' + 'placeholder="Empty" ng-model-onblur ng-change="child[key] = possibleNumber(val)"/>' + '</span>' + '</span>';

				// display either "plus button" or "key-value inputs"
				var addItemTemplate =
					'<div ng-switch on="showAddKey" class="block" >' + '<span ng-switch-when="true">';
				if (scope.type == "object") {
					// input key
					addItemTemplate += '<input placeholder="Name" type="text" ui-keyup="{\'enter\':\'addItem(child)\'}" ' + 'class="form-control input-sm addItemKeyInput" ng-model="$parent.keyName" /> ';
				}
				addItemTemplate +=
					// value type dropdown
					'<select ng-model="$parent.valueType" ng-options="option for option in valueTypes" class="form-control input-sm"' + 'ng-init="$parent.valueType=\'' + stringName + '\'" ui-keydown="{\'enter\':\'addItem(child)\'}"></select>'
					// input value
					+ '<span ng-show="$parent.valueType == \'' + stringName + '\'"> : <input type="text" placeholder="Value" ' + 'class="form-control input-sm addItemValueInput" ng-model="$parent.valueName" ui-keyup="{\'enter\':\'addItem(child)\'}"/></span> '
					// Add button
					+ '<button class="btn btn-primary btn-sm" ng-click="addItem(child)">Add</button> ' + '<button class="btn btn-default btn-sm" ng-click="$parent.showAddKey=false">Cancel</button>' + '</span>' + '<span ng-switch-default>'
					// plus button
					+ '<button class="addObjectItemBtn" ng-click="$parent.showAddKey = true"><i class="glyphicon glyphicon-plus"></i></button>' + '</span>' + '</div>';

				// start template
				if (scope.type == "object") {
					var template = '<i ng-click="toggleCollapse()" class="glyphicon" ng-class="chevron"></i>' + '<span class="jsonItemDesc">' + objectName + '</span>' +
						'<div class="jsonContents" ng-hide="collapsed">'
						// repeat
						+ '<span class="block" ng-hide="key.indexOf(\'_\') == 0" ng-repeat="(key, val) in child ">'
						// object key
						+ '<span class="jsonObjectKey">' + '<input class="keyinput" type="text" ng-model="newkey" ng-init="newkey=key" ' + 'ng-blur="moveKey(child, key, newkey)"/>' + '{{getType(key)}}'
						// delete button
						+ '<i class="deleteKeyBtn glyphicon glyphicon-trash" ng-click="deleteKey(child, key)"></i>' + '</span>'
						// object value
						+ '<span class="jsonObjectValue">' + switchTemplate + '</span>' + '</span>'
						// repeat end
						+ addItemTemplate + '</div>';
				} else if (scope.type == "array") {
					var template = '<i ng-click="toggleCollapse()" class="glyphicon"' + 'ng-class="chevron"></i>' + '<span class="jsonItemDesc">' + arrayName + '</span>' + '<div class="jsonContents" ng-hide="collapsed">' + '<ol class="arrayOl" ui-sortable="sortableOptions" ng-model="child">'
						// repeat
						+ '<li class="arrayItem" ng-repeat="val in child track by $index">'
						// delete button
						+ '<i class="deleteKeyBtn glyphicon glyphicon-trash" ng-click="deleteKey(child, $index)"></i>' + '<i class="moveArrayItemBtn glyphicon glyphicon-align-justify"></i>' + '<span>' + switchTemplate + '</span>' + '</li>'
						// repeat end
						+ '</ol>' + addItemTemplate + '</div>';
				} else {
					console.error("scope.type was " + scope.type);
				}

				var newElement = angular.element(template);
				$compile(newElement)(scope);
				element.replaceWith(newElement);
			}
		};
	}])