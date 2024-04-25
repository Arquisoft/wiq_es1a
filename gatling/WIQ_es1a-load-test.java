
import java.time.Duration;
import java.util.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import io.gatling.javaapi.jdbc.*;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;
import static io.gatling.javaapi.jdbc.JdbcDsl.*;

public class RecordedSimulation extends Simulation {

  private static final int CONCURRENT_USERS = 1000;

  private HttpProtocolBuilder httpProtocol = http
    .baseUrl("http://51.142.183.63:8000")
    .inferHtmlResources()
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.9,de;q=0.8")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
  
  private Map<CharSequence, String> headers_0 = Map.ofEntries(
    Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"),
    Map.entry("If-None-Match", "\"d91c7bed8c9649afbf3dc46f3f3b3227e9d5314f\""),
    Map.entry("Proxy-Connection", "keep-alive"),
    Map.entry("Upgrade-Insecure-Requests", "1")
  );
  
  private Map<CharSequence, String> headers_1 = Map.ofEntries(
    Map.entry("If-None-Match", "\"e697c0944ea2c51a1d92935f8d8bda9c3c8cc013\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_2 = Map.ofEntries(
    Map.entry("Accept", "text/css,*/*;q=0.1"),
    Map.entry("If-None-Match", "\"f71758f0c8b4038016c265305c09e71cf194cafe\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_3 = Map.ofEntries(
    Map.entry("If-None-Match", "\"22218a1d4e58f50805391425e373a58cfc469f5b\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_4 = Map.ofEntries(
    Map.entry("If-None-Match", "\"ddda15d631f5bdc396b06da2cd292a7594a998f5\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_5 = Map.ofEntries(
    Map.entry("If-None-Match", "\"51657fd68849dc6151b0e7dd3304603e229abaab\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_6 = Map.ofEntries(
    Map.entry("If-None-Match", "\"ccd73212853c680db513e01ab8b15fdddb28bcfd\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_7 = Map.ofEntries(
    Map.entry("If-None-Match", "\"95ccd48ba59b036810fc8d5a8f9d04772348b9e2\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_8 = Map.ofEntries(
    Map.entry("If-None-Match", "\"6c265ae74b7e3252c975b5b0a4cf3c7f4ab18179\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_9 = Map.ofEntries(
    Map.entry("If-None-Match", "\"ab897ae1607bcec62b6266e2717d913a873733bd\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_10 = Map.ofEntries(
    Map.entry("If-None-Match", "\"882d937ffc995be6f2f35f19d6129bc293f1bff1\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_11 = Map.ofEntries(
    Map.entry("If-None-Match", "\"6cfa38774cc68d7da6174dfdd329658920839062\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_12 = Map.ofEntries(
    Map.entry("If-None-Match", "\"614f7533e2b5821347ca76bbf20acbf196224b86\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_13 = Map.ofEntries(
    Map.entry("If-None-Match", "\"da4c79a9fa4034b5cc284f371bcf9a07c247c42f\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_14 = Map.ofEntries(
    Map.entry("If-None-Match", "\"67e2da3ac2e89b62cdf839ec488936895f4e433e\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_15 = Map.ofEntries(
    Map.entry("If-None-Match", "\"d16cfa53eec99d3192145b914f44954adbb220ec\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_16 = Map.ofEntries(
    Map.entry("If-None-Match", "\"0bb2586557b7a7c3978e7ee38dbc3432a0f78de5\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_17 = Map.ofEntries(
    Map.entry("If-None-Match", "\"1acb30615b55fe0a6ebf6851cae8d2fc9ff76fe6\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_18 = Map.ofEntries(
    Map.entry("If-None-Match", "\"dad9ba494d76a9790919ca85db50364bcde0adab\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_19 = Map.ofEntries(
    Map.entry("If-None-Match", "\"0a5f5673e46ce13f78c9e0c8589103d060c42df3\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_20 = Map.ofEntries(
    Map.entry("If-None-Match", "\"a3d2bee5d6c42802e1b5cc93ec3994574a8b3612\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_21 = Map.ofEntries(
    Map.entry("If-None-Match", "\"59f644e49e84cc95aa34d22be23a459e6b91740a\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_22 = Map.ofEntries(
    Map.entry("If-None-Match", "\"d18ee16ae296b40b80b2bf579eb3fae927a9669c\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_23 = Map.ofEntries(
    Map.entry("If-None-Match", "\"7ee2ceef4be1f85d352541f1a2b4387953893563\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_24 = Map.ofEntries(
    Map.entry("If-None-Match", "\"8846ce0b7bc6d7d701b77c62c5f99b19e93fa286\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_25 = Map.ofEntries(
    Map.entry("If-None-Match", "\"ef37cfd46e1db732b8dc2be0048b42b9751a5134\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_26 = Map.ofEntries(
    Map.entry("If-None-Match", "\"03eddc6a541ed427b2c9ac0634b07634a90e7571\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_27 = Map.ofEntries(
    Map.entry("If-None-Match", "\"b928e74311cc23150d65710da7690e58c424db46\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_28 = Map.ofEntries(
    Map.entry("If-None-Match", "\"a13f832cf02382bd6a23496ef9f0a66983a32d5a\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_29 = Map.ofEntries(
    Map.entry("If-None-Match", "\"a26ac198e7be1cad650c896b71fb773211e9b326\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_30 = Map.ofEntries(
    Map.entry("If-None-Match", "\"97c322768e3ec4b96a2061fa65d6e2fb917d93b2\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_31 = Map.ofEntries(
    Map.entry("If-None-Match", "\"aa39b7766b742e2f5b6e57d82dcc040f39dad317\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_32 = Map.ofEntries(
    Map.entry("If-None-Match", "\"40dc8441d06f37488b6dfc6d68f0f00def27c2f5\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_33 = Map.ofEntries(
    Map.entry("If-None-Match", "\"21d810e981ad8cc2c6aa4df7670bad6a1c35787b\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_34 = Map.ofEntries(
    Map.entry("If-None-Match", "\"c26323d8494d7977c7b29b26e0585fdde3d50659\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_35 = Map.ofEntries(
    Map.entry("If-None-Match", "\"7d0d0f725bc583eff622537e2806c55a8de49bff\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_36 = Map.ofEntries(
    Map.entry("If-None-Match", "\"dbc97e5d53259b01ba7fe62c8ab1730f1493395a\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_37 = Map.ofEntries(
    Map.entry("If-None-Match", "\"a1f48f146134d0d0bee381ebf31995516097ad85\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_38 = Map.ofEntries(
    Map.entry("If-None-Match", "\"78cc6660941f2db48135dcf2297f1b5d2039d358\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_39 = Map.ofEntries(
    Map.entry("If-None-Match", "\"f872788be7ac823113003d538351eee791d88c4f\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_40 = Map.ofEntries(
    Map.entry("If-None-Match", "\"bd2834e15d170101dabd15e1662cdad22d74e680\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_41 = Map.ofEntries(
    Map.entry("If-None-Match", "\"a7fd1f1a3993ef78e975732656aa31abe814e511\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_42 = Map.ofEntries(
    Map.entry("If-None-Match", "\"e52d3e72de5a5b6b1e5a71cb53fef5f233a7bcdc\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_43 = Map.ofEntries(
    Map.entry("If-None-Match", "\"1a42b2d090afbe146958d0a3edd0f22dd8f12893\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_44 = Map.ofEntries(
    Map.entry("If-None-Match", "\"c7e18514746d8fdb01fe6f49b0adb3c76a444df7\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_45 = Map.ofEntries(
    Map.entry("If-None-Match", "\"554d40e81965de55ec712307e4f72d8e2360c4bc\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_46 = Map.ofEntries(
    Map.entry("If-None-Match", "\"964075f947c9c1e965ec0ff60c2ddc2aba6fae18\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_47 = Map.ofEntries(
    Map.entry("If-None-Match", "\"f8804255a06937cbe57f352781b1f445428281ab\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_48 = Map.ofEntries(
    Map.entry("If-None-Match", "\"d8c053ad5bd1e178f572f617d829db709d51f609\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_49 = Map.ofEntries(
    Map.entry("If-None-Match", "\"c5eb7202b7a9cb4f4bd067896750709d41e7bd11\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_50 = Map.ofEntries(
    Map.entry("If-None-Match", "\"7c21004e5ccf8fef974dbb54ed9d207bb938c511\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_51 = Map.ofEntries(
    Map.entry("If-None-Match", "\"124b7b46a062b0838b1ec9911bb717d80475d4d4\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_52 = Map.ofEntries(
    Map.entry("If-None-Match", "\"b77dad59e5460da83374d4d7dd0f6eda2d87373c\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_53 = Map.ofEntries(
    Map.entry("If-None-Match", "\"ec9c34e3e4be75d9360f20c3783f9c7f2e70c422\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_54 = Map.ofEntries(
    Map.entry("If-None-Match", "\"368286873c22ba1eb6691c43e7f61131ae050b8a\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_55 = Map.ofEntries(
    Map.entry("If-None-Match", "\"d572e93961eedb62479b694834362497fa72c1a0\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_56 = Map.ofEntries(
    Map.entry("If-None-Match", "\"4a1f84b465a74f41c62f3d2d40a4de79168dfb47\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_57 = Map.ofEntries(
    Map.entry("If-None-Match", "\"8029613b4094bb2e640f092c0673547688e28275\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_58 = Map.ofEntries(
    Map.entry("If-None-Match", "\"0f4ee2c61543640e0b0b396a72c24ebdb5fe129a\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_59 = Map.ofEntries(
    Map.entry("If-None-Match", "\"73f78f6c945d0c5f7f7d0cbfefd50d1fc5c1af74\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_60 = Map.ofEntries(
    Map.entry("If-None-Match", "\"58a82f560d12a43e94f8d4fe880489a6bd4c6939\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_61 = Map.ofEntries(
    Map.entry("If-None-Match", "\"e58abdf3b9642371cf617a8c3bae0b8189026c67\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_62 = Map.ofEntries(
    Map.entry("If-None-Match", "\"a8b4c11acd94fa6df8c6d6eecda7f863c713a1cb\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_63 = Map.ofEntries(
    Map.entry("If-None-Match", "\"4112b2006f5806d227089533128c34ed85cd0ed4\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_64 = Map.ofEntries(
    Map.entry("If-None-Match", "\"fd0793483e6cdd722c83a8204eee5f0e48b4d6fd\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_65 = Map.ofEntries(
    Map.entry("If-None-Match", "\"f649ff7bf8083c1081e404fb848c39399a289394\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_66 = Map.ofEntries(
    Map.entry("If-None-Match", "\"fdac72cd330a2c631761bd24e63b48961e39155f\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_67 = Map.ofEntries(
    Map.entry("If-None-Match", "\"ba3aac5fb012b39b017f0fee3e8510e09c1efa22\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_68 = Map.ofEntries(
    Map.entry("If-None-Match", "\"dfb4b76dd65dc20c5c0cd82bec3463d0c05e1367\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_69 = Map.ofEntries(
    Map.entry("If-None-Match", "\"dcc2c461508d0d3f7155b1609816a8277ee12f07\""),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_70 = Map.ofEntries(
    Map.entry("Access-Control-Request-Headers", "content-type"),
    Map.entry("Access-Control-Request-Method", "POST"),
    Map.entry("Origin", "http://20.77.20.70:3000"),
    Map.entry("Proxy-Connection", "keep-alive"),
    Map.entry("Sec-Fetch-Mode", "cors")
  );
  
  private Map<CharSequence, String> headers_71 = Map.ofEntries(
    Map.entry("Accept", "application/json, text/plain, */*"),
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://20.77.20.70:3000"),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_73 = Map.ofEntries(
    Map.entry("Content-Type", "application/json"),
    Map.entry("Origin", "http://20.77.20.70:3000"),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private Map<CharSequence, String> headers_78 = Map.ofEntries(
    Map.entry("Origin", "http://20.77.20.70:3000"),
    Map.entry("Proxy-Connection", "keep-alive")
  );
  
  private String uri2 = "http://20.77.20.70:3000";

  private ScenarioBuilder scn = scenario("RecordedSimulation")
    .exec(
      http("request_0")
        .get(uri2 + "/home")
        .headers(headers_0)
        .resources(
          http("request_1")
            .get(uri2 + "/static/js/main.c4ca4795.js")
            .headers(headers_1),
          http("request_2")
            .get(uri2 + "/static/css/main.8d39ec3b.css")
            .headers(headers_2),
          http("request_3")
            .get(uri2 + "/static/js/7590.c5e06ce4.chunk.js")
            .headers(headers_3),
          http("request_4")
            .get(uri2 + "/static/js/6725.f567d58c.chunk.js")
            .headers(headers_4),
          http("request_5")
            .get(uri2 + "/static/js/8122.28224e1c.chunk.js")
            .headers(headers_5),
          http("request_6")
            .get(uri2 + "/static/js/3764.b947f0c4.chunk.js")
            .headers(headers_6),
          http("request_7")
            .get(uri2 + "/static/js/1070.3d6e218c.chunk.js")
            .headers(headers_7),
          http("request_8")
            .get(uri2 + "/static/js/1604.708de594.chunk.js")
            .headers(headers_8),
          http("request_9")
            .get(uri2 + "/static/js/4570.d9c3f629.chunk.js")
            .headers(headers_9),
          http("request_10")
            .get(uri2 + "/static/js/2314.dd55aa48.chunk.js")
            .headers(headers_10),
          http("request_11")
            .get(uri2 + "/static/js/2330.ed2d3846.chunk.js")
            .headers(headers_11),
          http("request_12")
            .get(uri2 + "/static/js/6646.5c06dcba.chunk.js")
            .headers(headers_12),
          http("request_13")
            .get(uri2 + "/static/js/599.88cf3da2.chunk.js")
            .headers(headers_13),
          http("request_14")
            .get(uri2 + "/static/js/175.920c7854.chunk.js")
            .headers(headers_14),
          http("request_15")
            .get(uri2 + "/static/js/5817.4aa6d92f.chunk.js")
            .headers(headers_15),
          http("request_16")
            .get(uri2 + "/static/js/2427.f1662edc.chunk.js")
            .headers(headers_16),
          http("request_17")
            .get(uri2 + "/static/js/4708.97193c2b.chunk.js")
            .headers(headers_17),
          http("request_18")
            .get(uri2 + "/static/js/615.5db4987c.chunk.js")
            .headers(headers_18),
          http("request_19")
            .get(uri2 + "/static/js/464.85dd3c4d.chunk.js")
            .headers(headers_19),
          http("request_20")
            .get(uri2 + "/static/js/3739.b4ab6450.chunk.js")
            .headers(headers_20),
          http("request_21")
            .get(uri2 + "/static/js/9295.49331bf4.chunk.js")
            .headers(headers_21),
          http("request_22")
            .get(uri2 + "/static/js/9482.106a17ff.chunk.js")
            .headers(headers_22),
          http("request_23")
            .get(uri2 + "/static/js/6341.005beb2e.chunk.js")
            .headers(headers_23),
          http("request_24")
            .get(uri2 + "/static/js/2975.01ed97e1.chunk.js")
            .headers(headers_24),
          http("request_25")
            .get(uri2 + "/static/js/2478.3a3820d6.chunk.js")
            .headers(headers_25),
          http("request_26")
            .get(uri2 + "/static/js/3579.1b7115d9.chunk.js")
            .headers(headers_26),
          http("request_27")
            .get(uri2 + "/static/js/719.366b2dd2.chunk.js")
            .headers(headers_27),
          http("request_28")
            .get(uri2 + "/static/js/39.5f31b79e.chunk.js")
            .headers(headers_28),
          http("request_29")
            .get(uri2 + "/static/js/6864.77215098.chunk.js")
            .headers(headers_29),
          http("request_30")
            .get(uri2 + "/static/js/5033.71cbdd2f.chunk.js")
            .headers(headers_30),
          http("request_31")
            .get(uri2 + "/static/js/1638.45ee6312.chunk.js")
            .headers(headers_31),
          http("request_32")
            .get(uri2 + "/static/js/4843.a916ad46.chunk.js")
            .headers(headers_32),
          http("request_33")
            .get(uri2 + "/static/js/4752.2a9d3e28.chunk.js")
            .headers(headers_33),
          http("request_34")
            .get(uri2 + "/static/js/7688.a7829ff6.chunk.js")
            .headers(headers_34),
          http("request_35")
            .get(uri2 + "/static/js/8064.3092e1de.chunk.js")
            .headers(headers_35),
          http("request_36")
            .get(uri2 + "/static/js/8438.5ad40243.chunk.js")
            .headers(headers_36),
          http("request_37")
            .get(uri2 + "/static/js/5474.eaca7671.chunk.js")
            .headers(headers_37),
          http("request_38")
            .get(uri2 + "/static/js/7604.c472a1ec.chunk.js")
            .headers(headers_38),
          http("request_39")
            .get(uri2 + "/static/js/5376.4b618f88.chunk.js")
            .headers(headers_39),
          http("request_40")
            .get(uri2 + "/static/js/2093.ea3c68f2.chunk.js")
            .headers(headers_40),
          http("request_41")
            .get(uri2 + "/static/js/4426.907c0dc1.chunk.js")
            .headers(headers_41),
          http("request_42")
            .get(uri2 + "/static/js/1928.bfabbcab.chunk.js")
            .headers(headers_42),
          http("request_43")
            .get(uri2 + "/static/js/308.d62d7875.chunk.js")
            .headers(headers_43),
          http("request_44")
            .get(uri2 + "/static/js/5536.9fcdee56.chunk.js")
            .headers(headers_44),
          http("request_45")
            .get(uri2 + "/static/js/4927.d7f5103b.chunk.js")
            .headers(headers_45),
          http("request_46")
            .get(uri2 + "/static/js/1927.23448b3d.chunk.js")
            .headers(headers_46),
          http("request_47")
            .get(uri2 + "/static/js/9558.f114e76b.chunk.js")
            .headers(headers_47),
          http("request_48")
            .get(uri2 + "/static/js/8731.d4d8f343.chunk.js")
            .headers(headers_48),
          http("request_49")
            .get(uri2 + "/static/js/1215.de6ceb6f.chunk.js")
            .headers(headers_49),
          http("request_50")
            .get(uri2 + "/static/js/8427.a997aaec.chunk.js")
            .headers(headers_50),
          http("request_51")
            .get(uri2 + "/static/js/4494.575104e3.chunk.js")
            .headers(headers_51),
          http("request_52")
            .get(uri2 + "/static/js/231.c36e07b2.chunk.js")
            .headers(headers_52),
          http("request_53")
            .get(uri2 + "/static/js/8800.5f03cc93.chunk.js")
            .headers(headers_53),
          http("request_54")
            .get(uri2 + "/static/js/4265.9d3420e9.chunk.js")
            .headers(headers_54),
          http("request_55")
            .get(uri2 + "/static/js/9644.11631de7.chunk.js")
            .headers(headers_55),
          http("request_56")
            .get(uri2 + "/static/js/7055.0a3c9315.chunk.js")
            .headers(headers_56),
          http("request_57")
            .get(uri2 + "/static/js/7454.8a24d2ad.chunk.js")
            .headers(headers_57),
          http("request_58")
            .get(uri2 + "/static/js/2279.38706dba.chunk.js")
            .headers(headers_58),
          http("request_59")
            .get(uri2 + "/static/js/5080.fc3ac049.chunk.js")
            .headers(headers_59),
          http("request_60")
            .get(uri2 + "/static/js/4304.f6a01a80.chunk.js")
            .headers(headers_60),
          http("request_61")
            .get(uri2 + "/static/js/6198.f482131c.chunk.js")
            .headers(headers_61),
          http("request_62")
            .get(uri2 + "/static/js/3275.c68c347d.chunk.js")
            .headers(headers_62),
          http("request_63")
            .get(uri2 + "/static/js/7788.d6b4138f.chunk.js")
            .headers(headers_63),
          http("request_64")
            .get(uri2 + "/static/js/656.734292f5.chunk.js")
            .headers(headers_64),
          http("request_65")
            .get(uri2 + "/static/js/9628.5e10cefd.chunk.js")
            .headers(headers_65),
          http("request_66")
            .get(uri2 + "/static/js/6964.3c5058f3.chunk.js")
            .headers(headers_66),
          http("request_67")
            .get(uri2 + "/static/js/2323.333da97e.chunk.js")
            .headers(headers_67),
          http("request_68")
            .get(uri2 + "/static/js/6118.aba3416d.chunk.js")
            .headers(headers_68),
          http("request_69")
            .get(uri2 + "/static/js/4290.a3dc8f9d.chunk.js")
            .headers(headers_69)
        ),
      pause(10),
      http("request_70")
        .options("/login")
        .headers(headers_70)
        .resources(
          http("request_71")
            .post("/login")
            .headers(headers_71)
            .body(RawFileBody("recordedsimulation/0071_request.json"))
        ),
      pause(1),
      http("request_72")
        .options("/questions")
        .headers(headers_70)
        .resources(
          http("request_73")
            .post("/questions")
            .headers(headers_73)
            .body(RawFileBody("recordedsimulation/0073_request.json"))
        ),
      pause(41),
      http("request_74")
        .options("/saveGameList")
        .headers(headers_70)
        .resources(
          http("request_75")
            .post("/saveGameList")
            .headers(headers_71)
            .body(RawFileBody("recordedsimulation/0075_request.json")),
          http("request_76")
            .options("/saveGame")
            .headers(headers_70),
          http("request_77")
            .post("/saveGame")
            .headers(headers_71)
            .body(RawFileBody("recordedsimulation/0077_request.json"))
        ),
      pause(3),
      http("request_78")
        .get("/users/search?username=admin")
        .headers(headers_78),
      pause(1),
      http("request_79")
        .get("/friends?user=admin")
        .headers(headers_78),
      pause(1),
      http("request_80")
        .get("/stats?user=admin&gamemode=clasico")
        .headers(headers_78),
      pause(2),
      http("request_81")
        .get("/ranking?gamemode=clasico&filterBy=avgPoints")
        .headers(headers_78),
      pause(1),
      http("request_82")
        .get("/userInfo?user=admin")
        .headers(headers_78),
      pause(11),
      http("request_83")
        .options("/saveGame")
        .headers(headers_70)
        .resources(
          http("request_84")
            .post("/saveGame")
            .headers(headers_71)
            .body(RawFileBody("recordedsimulation/0084_request.json"))
            .check(status().is(400)),
          http("request_85")
            .options("/saveGameList")
            .headers(headers_70),
          http("request_86")
            .post("/saveGameList")
            .headers(headers_71)
            .body(RawFileBody("recordedsimulation/0086_request.json"))
        )
    );

  {
	  setUp(scn.injectOpen(atOnceUsers(1000))).protocols(httpProtocol);
  }
}
