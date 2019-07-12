package com.olakeji.passenger.wechat.online;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.olakeji.cache.RedisUtil;
import com.olakeji.passenger.Application;
import com.olakeji.passenger.mock.MockService;
import com.olakeji.tsp.common.Constant;
import com.olakeji.tsp.common.order.PayNotifyEvent;
import com.olakeji.tsp.utils.DateUtils;
import com.olakeji.tsp.utils.GsonUtil;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class) // 这里的Application是springboot的启动类名。
@WebAppConfiguration
public class MockController {
	private final Logger LOGGER = LoggerFactory.getLogger(MockController.class);

	@Autowired
	private WebApplicationContext context;
	private MockMvc mvc;

	@Resource
	private MockService baseService;

	Map<String, String> reqMap = new HashMap<String, String>();

	@Autowired
	RedisUtil redisUtil;

	@Before
	public void setUp() throws Exception {
		baseService.initData();
	}

	/**
	 * 查询优惠券列表
	 * 
	 * @throws Exception
	 */
	@Test
	public void queryUserValidCoupons() throws Exception {
		this.reqMap.clear();
		this.reqMap.put("businessType", String.valueOf(Constant.businessType.ONLINE_CAR));
		this.reqMap.put("orderNo", "1221531883218826107933");
		baseService.performPassengerApi("/baseOnlineCar/queryUserValidCoupons", this.reqMap);
	}

	@Test
	public void tripPrice() throws Exception {
		this.reqMap.clear();
		this.reqMap.put("departLng", "113.870711");
		this.reqMap.put("departLat", "22.568908");
		this.reqMap.put("arriveLng", "113.863048");
		this.reqMap.put("arriveLat", "22.575149");
		this.reqMap.put("cityId", "440300");
		this.reqMap.put("departType", "1");
		this.reqMap.put("departTime", "");
		this.reqMap.put("departDate", DateUtils.getCurDate());

		baseService.perform("/onlineTrip/tripPrice", this.reqMap);
		baseService.performPassengerApi("/buyActivity/queryUserValidCoupons", this.reqMap);
	}

	@Test
	public void checkZeroTspPay() throws Exception {
		this.reqMap.clear();
		this.reqMap.put("orderNo", "1311538019035424206352");
		this.reqMap.put("token", "dTlubVVJd20zRHpicERGTjVPSmhYWEw3SnlRQ0hXRjVmWS8xZFh2Y3FUZS8");

		baseService.performPassengerApi("/onlineCarPay/checkZeroTspPay", this.reqMap);
	}

	@Test
	public void insertOrderKeys() {

		String[] orderNo1 = { "162153791849824252016892", "162153813817764953246317", "162153814206814134227616",
				"162153814497470753259636" };
		List<String> orderNo = Arrays.asList(orderNo1);
		orderNo.forEach(item -> {
			String redisKey = "pay-notify:" + item;
			String redisKey1 = item + "pay-notify:";

			PayNotifyEvent event = PayNotifyEvent.Get();
			event.setFirstTime(System.currentTimeMillis());
			event.setUpdateTime(0L);
			event.setCount(1);
			event.setOrderNo(item);
			event.setNotifyUrl("https://api.passenger.zhongjiaochuxing.com/busTicketOrder/payNotify");
			event.setOrderType(6);
			event.setKeyId(0);
			redisUtil.remove(redisKey);
			redisUtil.remove(redisKey1);
			redisUtil.set(redisKey, GsonUtil.GsonString(event), 24 * 60 * 60L * 10);

			try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});
	}

	private void initOrders() {
		String[] orderNo1 = { "162153804457457215757251", "162153806088281134889192", "162153811703613820528085",
				"162153813682406015639745", "162153813685470952549982", "162153813685741529769869",
				"162153813686379628455999", "162153813686638139892751", "162153813686966553244163",
				"162153813687612527394748", "162153813687808829119195", "162153813688957334617193",
				"162153813689232037541316", "162153813689266729560681", "162153813689640715227172",
				"162153813690213522141794", "162153813690621852409632", "162153813694447451565539",
				"162153813694748531811395", "162153813697306238514533", "162153813698836233924314",
				"162153813700389251922614", "162153813700563916650727", "162153813701367131745265",
				"162153813701406418310249", "162153813701822533924319", "162153813703061353244492",
				"162153813703106918560799", "16215381370333648492373", "162153813703645033134950",
				"162153813704492353072441", "162153813706625413166086", "162153813706982221021315",
				"162153813707580229116521", "162153813707746013245797", "162153813709698539413851",
				"162153813709841251444917", "162153813710093853244693", "162153813710201230606792",
				"162153813711611113544780", "162153813711891215811092", "162153813712029021021324",
				"162153813712467339019078", "162153813712849152768139", "162153813713715529050466",
				"162153813714365853242910", "162153813714479337373118", "162153813715347133796350",
				"162153813716520853245069", "162153813716935630812145", "162153813717380521181636",
				"162153813718942521686956", "162153813719317253244590", "162153813720310130812159",
				"162153813720501517959458", "162153813721755253244061", "162153813723030615639774",
				"162153813723705214386539", "162153813724007553238882", "162153813724091915375120",
				"162153813724500253191785", "162153813727178352746362", "162153813727361239010782",
				"162153813728081437106034", "162153813729321820725793", "162153813729881853245120",
				"162153813731384619235617", "162153813732401010927672", "162153813732845816568219",
				"162153813734025353245390", "162153813735090437530611", "162153813735253319901748",
				"162153813735650828515062", "162153813737039317850792", "162153813739321632715746",
				"162153813742338913544779", "162153813743557830151085", "162153813744019022054984" };
	}
	
	@Test
	public void queryValidConponByBusiness() throws Exception {
		this.reqMap.clear();
		this.reqMap.put("orderNo", "1311540290263789374724");
		this.reqMap.put("token", "dG84YXBhRXNVVnhRMm9QQWl1bnA4aW9nWkUrYUpMd3RYNkZwYmFQVWU1eU4");
		this.reqMap.put("businessType", "10");

		baseService.performPassengerApi("/Coupon/queryValidConponByBusiness", this.reqMap);

	}
}
