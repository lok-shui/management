import Vue from "vue";
import {
  LocaleProvider,
  Input,
  Button,
  Form,
  Layout,
  Dropdown,
  Menu,
  Table,
  Tag,
  Icon,
  Select,
  Cascader,
  message,
  Radio,
  Modal,
  InputNumber,
  Spin,
  TreeSelect,
  DatePicker,
  Popconfirm,
  Checkbox,
  Upload,
  Row,
  Col,
  Tabs,
  Divider
} from "ant-design-vue";

Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;

Vue.use(LocaleProvider);
Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(Layout);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Select);
Vue.use(Cascader);
Vue.use(Radio);
Vue.use(Modal);
Vue.use(InputNumber);
Vue.use(Spin);
Vue.use(TreeSelect);
Vue.use(DatePicker);
Vue.use(Popconfirm);
Vue.use(Checkbox);
Vue.use(Upload);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tabs);
Vue.use(Divider);
