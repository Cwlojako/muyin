<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
    <!--    按钮和分页-->
    <el-col :span="24">
      <div>
        <div class="pager-group">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, jumper, prev, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table :data="data" ref="multipleTable">
        <el-table-column label="选择" width="80">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id" @change="onChange">选择</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="文章标题"></el-table-column>
        <el-table-column prop="updateAt" label="修改时间"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import Emitter from '@/framework/mixins/emitter'
  import {searchGoods, countGoods, getCategory} from '@/project/service/goods' //接口

  export default {
    name:'goods',
    mixins: [Emitter],

    data() {
      return {
        categoryListName:[],
        categoryListId:[],
        model: "goods",
        editId: 0,//编辑id
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "文章标题",
            key: "title",
            type: "string"
          },
          {
            name: "关键字",
            key: "keyword",
            type: "string"
          }
        ],
        radio:0
      };
    },
    created() {
      this.$store.dispatch('GET_USER_CACHE')
      this.search(1)
    },
    components: {
      Search,
    },
    methods: {
      handlePageSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(1);
      },
      handlePageChange(page) {
        this.search(page);
      },
      searchBySearchItem(searchItems) {
        let keys = [];
        for (
          let i = 0,
            searchItemList = this.searchItems,
            len = searchItemList.length;
          i < len;
          i++
        ) {
          keys.push(searchItemList[i].key);
        }
        for (let i in keys) {
          if (searchItems[keys[i]]) {
            this.extraParam[keys[i]] = searchItems[keys[i]];
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        this.search(1);
      },
      search(page) {
        let _t = this;
        _t.page = page;
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
            sort: _t.sort
          }
        };
        for(let key in _t.extraParam){
          param[key] = _t.extraParam[key];
        }
        searchGoods(param, res => {
          let data = res;
          _t.data = data;
          _t.getTotal();
        });
      },
      getTotal() {
        let _t = this;
        let param = {};
        for (let key in _t.extraParam) {
          param[key]=_t.extraParam[key];
        }
        countGoods(param, res => {
          _t.total = parseInt(res);
        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(this.page);
      },

      onChange(val) {
        this.$emit('on-select-id',val);
      }
    },
    mounted() {
      // 获取商品分类数据信息
      getCategory({}, res => {
        res.forEach(item => {
          if(item.status=='已启用'){
            this.categoryListName.push(item.name)
            this.categoryListId.push(item.id)
            this.searchItems[1].displayValue=this.categoryListName
            this.searchItems[1].value=this.categoryListName
          }
        })
      })
    }
  };
</script>
<style lang="less" scoped>

</style>
