google.maps.__gjsload__('overlay', function(_){var Zy=_.na("b"),$y=_.ma(),az=function(){var a=this.nf;if(this.getPanes()){if(this.getProjection()){if(!a.b&&this.onAdd)this.onAdd();a.b=!0;this.draw()}}else{if(a.b)if(this.onRemove)this.onRemove();else this.remove();a.b=!1}},bz=function(a){a.nf=a.nf||new $y;return a.nf},cz=function(a){_.yf.call(this);this.$=(0,_.p)(az,a)};_.t(Zy,_.z);
Zy.prototype.changed=function(a){"outProjection"!=a&&(a=!!(this.get("offset")&&this.get("projectionTopLeft")&&this.get("projection")&&_.lb(this.get("zoom"))),a==!this.get("outProjection")&&this.set("outProjection",a?this.b:null))};_.t(cz,_.yf);_.gd("overlay",{Sj:function(a){var b=a.getMap(),c=bz(a),d=c.Ul;c.Ul=b;d&&(c=bz(a),(d=c.W)&&d.unbindAll(),(d=c.yh)&&d.unbindAll(),a.unbindAll(),a.set("panes",null),a.set("projection",null),_.v(c.P,_.x.removeListener),c.P=null,c.be&&(c.be.$(),c.be=null),_.hn("Ox","-p",a));if(b){c=bz(a);d=c.be;d||(d=c.be=new cz(a));_.v(c.P||[],_.x.removeListener);var e=c.W=c.W||new _.Yl,f=b.__gm;e.bindTo("zoom",f);e.bindTo("offset",f);e.bindTo("center",f,"projectionCenterQ");e.bindTo("projection",b);e.bindTo("projectionTopLeft",
f);e=c.yh=c.yh||new Zy(e);e.bindTo("zoom",f);e.bindTo("offset",f);e.bindTo("projection",b);e.bindTo("projectionTopLeft",f);a.bindTo("projection",e,"outProjection");a.bindTo("panes",f);e=(0,_.p)(d.K,d);c.P=[_.x.addListener(a,"panes_changed",e),_.x.addListener(f,"zoom_changed",e),_.x.addListener(f,"offset_changed",e),_.x.addListener(b,"projection_changed",e),_.x.addListener(f,"projectioncenterq_changed",e),_.x.forward(b,"forceredraw",d)];d.K();b instanceof _.Je&&(_.en(b,"Ox"),_.gn("Ox","-p",a,!!b.U))}}});});
