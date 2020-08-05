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
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search"
  import Emitter from '@/framework/mixins/emitter'
  import { search, count } from '@/project/service/post'

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
        searchItems: [
          {
            name: "文章标题",
            key: "title",
            type: "string"
          },
          {
            name: "关键字",
            key: "content",
            type: "string"
          }
        ],
        radio: 0
      };
    },
    props: {
      articleId: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.search(1)
    },
    components: {
      Search
    },
    methods: {
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
          } else {
            delete this.extraParam[keys[i]];
          }
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
          post: this.extraParam
        }
        search(param, res => {
          this.data = res
          this.getTotal()
          // 编辑模式下选中已选文章
          if (this.articleId) {
            this.radio = this.articleId
          }
        })
      },
      getTotal() {
        let param = {
          post: this.extraParam
        }
        count(param, res => {
          this.total = parseInt(res);
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.search(this.page)
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.search(this.page)
      },
      onChange(val) {
        console.log(val)
        // 传递所选行的id值
        this.$emit('on-select-id', val)
      }
    }
  };
</script>
<style lang="less" scoped>

</style>
