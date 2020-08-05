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
        <el-table-column prop="name" label="商品名称&型号"></el-table-column>
        <el-table-column prop="category.name" label="商品分类"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search"
  import Emitter from '@/framework/mixins/emitter'
  import { search, count } from '@/project/service/product'
  import { searchCategory } from '@/project/service/category'

  export default {
    mixins: [Emitter],
    data() {
      return {
        editId: 0,//编辑id
        data: [],
        selectList: [],
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        categoryParam: {},
        searchItems: [
          {
            name: "商品名称",
            key: "name",
            type: "string"
          },
          {
            name: "商品分类",
            key: "category",
            type: "select",
            displayValue: [],
            value: []
          }
        ],
        radio:0
      };
    },
    props: {
      productId: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.search(1)
      // 获取商品一级分类可选项
      this.getCategoryOption()
    },
    components: {
      Search
    },
    methods: {
      // 获取商品一级分类可选项
      getCategoryOption() {
        searchCategory({child: {}}, res => {
          this.categoryOptions = res
          let value = []
          res.forEach(item => {
            value.push(item.name)
          })
          this.searchItems.find(item => item.key === 'category').displayValue = value
          this.searchItems.find(item => item.key === 'category').value = value
        })
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
            this.extraParam[keys[i]] = searchItems[keys[i]]
            if (keys[i] === 'category') delete this.extraParam[keys[i]]
          } else {
            delete this.extraParam[keys[i]];
          }
        }
        // 处理分类搜索参数
        if (searchItems.category) {
          this.categoryParam = {
            name: searchItems.category
          }
        } else {
          delete this.categoryParam
        }
        this.search(1);
      },
      search(page) {
        this.page = page
        let param = {
          pageable: {
            page: page,
            size: this.pageSize
          },
          product: this.extraParam,
          category: this.categoryParam
        }
        // 如果参数不需要则清除
        if (JSON.stringify(param.category) === "{}") delete param.category
        search(param, res => {
          this.data = res
          this.getTotal()
          // 编辑模式下选中已选商品
          if (this.productId) {
            this.radio = this.productId
          }
        })
      },
      getTotal() {
        let param = {
          product: this.extraParam,
          category: this.categoryParam
        }
        // 如果参数不需要则清除
        if (JSON.stringify(param.category) === "{}") delete param.category
        count(param, res => {
          this.total = parseInt(res);
        })
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
        console.log(val)
        // 传递所选行的id值
        this.$emit('on-select-id', val);
      }
    }
  };
</script>
<style lang="less" scoped>

</style>
