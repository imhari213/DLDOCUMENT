pragma solidity ^0.4.0;


contract certificate {
    

    
    string hash;
    address owner;
    
    function certificate (){
        
       owner = msg.sender;
        
    }
    
    modifier isowner(){
        
        require(owner == msg.sender);
        _;
        
    }
    
    
    function generate_certificate(string has) isowner {
        
        hash = has;
        
    }
    
    function get_hash() public returns(string) {
        
        return hash;
        
    }
    
    
    
    
}
