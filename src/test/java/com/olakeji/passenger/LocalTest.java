package com.olakeji.passenger;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import com.olakeji.tsp.common.ResultEntity;
import org.junit.Test;
import org.springframework.util.CollectionUtils;

import com.olakeji.tsp.utils.GsonUtil;

public class LocalTest {

    @Test
    public void SortCoupons() throws Exception {
    	long time = System.currentTimeMillis();
    	List<UserCouponVo> lst = new ArrayList<UserCouponVo>();
    	
    	UserCouponVo vo = new UserCouponVo();
    	vo.setAmount(new BigDecimal(1.5));
    	vo.setMinLimitAmount(0);
    	vo.setEndTime(time);
    	vo.setRecordId(new Long(105));
    	lst.add(vo);

    	vo = new UserCouponVo();
    	vo.setAmount(new BigDecimal(0.7));
    	vo.setMinLimitAmount(0);
    	vo.setEndTime(time);
    	vo.setRecordId(new Long(106));
    	lst.add(vo);

    	vo = new UserCouponVo();
    	vo.setAmount(new BigDecimal(1.1));
    	vo.setMinLimitAmount(0);
    	vo.setEndTime(time);
    	vo.setRecordId(new Long(107));
    	lst.add(vo);

    	vo = new UserCouponVo();
    	vo.setAmount(new BigDecimal(1.3));
    	vo.setMinLimitAmount(0);
    	vo.setEndTime(time);
    	vo.setRecordId(new Long(102));
    	lst.add(vo);

    	vo = new UserCouponVo();
    	vo.setAmount(new BigDecimal(0.8));
    	vo.setMinLimitAmount(0);
    	vo.setEndTime(time);
    	vo.setRecordId(new Long(106));
    	lst.add(vo);

    	vo = new UserCouponVo();
    	vo.setAmount(new BigDecimal(1.0));
    	vo.setMinLimitAmount(0);
    	vo.setEndTime(time);
    	vo.setRecordId(new Long(103));
    	lst.add(vo);

    	sortCoupons(lst, new BigDecimal(1.2));
    	
    	System.out.println(GsonUtil.GsonString(lst));
    }
    
	private void sortCoupons(List<UserCouponVo> couponsList, BigDecimal price) {		
		if (!CollectionUtils.isEmpty(couponsList)) {
			Comparator<UserCouponVo> comparator = new Comparator<UserCouponVo>() {
				@Override
				public int compare(UserCouponVo crr1, UserCouponVo crr2) {
					if(crr2.getAmount().compareTo(crr1.getAmount())!=0){
						if (crr1.getAmount().compareTo(price) > 0) {
							return crr2.getAmount().compareTo(crr1.getAmount());
						}
						else {
							return crr1.getAmount().compareTo(crr2.getAmount());
						}
					}else if(crr1.getMinLimitAmount()!=crr2.getMinLimitAmount()){
						//限制金额高的排到前面
						return crr2.getMinLimitAmount().compareTo(crr1.getMinLimitAmount());
					}else if(crr1.getEndTime().compareTo(crr2.getEndTime())!=0){
						return crr1.getEndTime().compareTo(crr2.getEndTime());
					}else if(crr1.getRecordId().compareTo(crr2.getRecordId())!=0){
						return crr1.getRecordId().compareTo(crr2.getRecordId());
					}
					return 0;
				}
			};
			Collections.sort(couponsList, comparator);
		}
	}

	@Test
	void test1() {

	}
    
}
