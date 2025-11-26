// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title InfoContract
 * @dev 用于存储数据到区块链的智能合约
 * 通过事件日志的形式记录数据,可以使用 The Graph 进行索引
 */
contract InfoContract {
    // 数据结构
    struct Info {
        address sender;      // 发送者地址
        string name;         // 数据名称
        string data;         // 数据内容
        uint256 timestamp;   // 时间戳
    }
    
    // 存储所有信息
    Info[] public infos;
    
    // 事件:当信息被存储时触发
    event InfoStored(
        address indexed sender,
        string name,
        string data,
        uint256 timestamp
    );
    
    /**
     * @dev 存储信息到区块链
     * @param _name 数据名称
     * @param _data 数据内容
     */
    function storeInfo(string memory _name, string memory _data) public {
        Info memory newInfo = Info({
            sender: msg.sender,
            name: _name,
            data: _data,
            timestamp: block.timestamp
        });
        
        infos.push(newInfo);
        
        // 触发事件,The Graph 可以监听这个事件
        emit InfoStored(msg.sender, _name, _data, block.timestamp);
    }
    
    /**
     * @dev 获取信息总数
     */
    function getInfoCount() public view returns (uint256) {
        return infos.length;
    }
    
    /**
     * @dev 获取指定索引的信息
     */
    function getInfo(uint256 index) public view returns (
        address sender,
        string memory name,
        string memory data,
        uint256 timestamp
    ) {
        require(index < infos.length, "Index out of bounds");
        Info memory info = infos[index];
        return (info.sender, info.name, info.data, info.timestamp);
    }
}
