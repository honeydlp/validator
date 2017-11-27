class Strategys{
    isNotEmpty(value,errorMsg) {
        if(value === '') {
            return errorMsg;
        }
  }
  // 限制最小长度
    minLength(value,length,errorMsg) {
        if(value.length < length) {
            return errorMsg;
        }
    }
  // 手机号码格式
    mobileFormat(value,errorMsg) {
        if(!/(^1[3|5|6|7|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }   
}
 
class Validator extends Strategys{
    constructor(){
        super();
        this.cache = []; 
    }
    add(value,rules){
        var self = this;
        for(var i = 0, rule; rule = rules[i++]; ){ //
            (function(rule){
                var strategyAry = rule.strategy.split(":");  
                var errorMsg = rule.errorMsg;
                self.cache.push(function(){
                    var strategy = strategyAry.shift(); //前删除
                    strategyAry.unshift(value);     
                    strategyAry.push(errorMsg);
                    return self[strategy].apply(self,strategyAry);
                });
            })(rule);
        }
    }
    start(){
        for(var i = 0, validatorFunc; validatorFunc = this.cache[i++]; ) {
            var msg = validatorFunc(); // 开始效验 并取得效验后的返回信息
            if(msg) {
                return msg;
            }
        }      
    }
}

var validateFunc = ()=>{
    var validator = new Validator(); // 创建一个Validator对象
    /* 添加一些效验规则 */
    validator.add('dlp',[
        {strategy: 'isNotEmpty',errorMsg:'用户名不能为空'},
        {strategy: 'minLength:6',errorMsg:'用户名长度不能小于6位'}
    ]);
    var errorMsg = validator.start(); // 获得效验结果
    return errorMsg; // 返回效验结果
  };
  var errorMsg = validateFunc();
  if(errorMsg){
      console.log(errorMsg);
  }