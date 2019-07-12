package com.olakeji.passenger.wechat.entity.annual;

import java.io.Serializable;

public class BaseUserVo implements Serializable {
    private String nickName;
    private String avatar;
    public BaseUserVo(){}

    public BaseUserVo( String nickName, String avatar, String wechatOpenId) {
        this.nickName = nickName;
        this.avatar = avatar;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}
