this.generate_sample_query = function(template_id) {
  return $("#txt_sparql_query").val($("#txt_sample_query_" + template_id).html());
};

this.display_sparql_literal = function(data) {
  var display_text;
  display_text = break_words(html_safe(data.value));
  if (data["xml:lang"] !== void 0) {
    display_text += "&nbsp;<span class='badge'>" + data["xml:lang"] + "</span>";
  }
  return "<td class='result-col-uri' style=\"word-wrap: break;\">" + display_text + "</td>";
};

this.display_sparql_typed_literal = function(data) {
  return "<td class='result-col-uri' style=\"word-wrap: break;\">" + data.value + "</td>";
};

this.display_blank_result_column = function() {
  return "<td class= style=\"word-wrap: break;\">&nbsp;</td>";
};

this.display_sparql_uri = function(data) {
  var uri_display;
  uri_display = data.value;
  if (uri_display.length > 60) {
    uri_display = data.value.substring(0, 60) + "...";
  }
  return "<td class='result-col-uri' uri=\"" + data.value + "\"><a onclick=Utils.show_uri_viewer('" + data.value + "') class='clickable'>" + uri_display + "</a></td>";
};

this.display_sparql_row_entry = function(data) {
  if (data.type === "uri") {
    return display_sparql_uri(data);
  } else if (data.type === "literal") {
    return display_sparql_literal(data);
  } else if (data.type === "typed-literal") {
    return display_sparql_typed_literal(data);
  } else {
    return display_blank_result_column();
  }
};

this.execute_sparql_query = function() {
  if (SPARQL.textbox.is_valid()) {
    show_loading();
    $("#sparql_results_container").hide();
    $.post(get_server_address() + "/query/execute_sparql", {
      query: $("#txt_sparql_query").val(),
      dataset: QueryBuilder.datasets.get_selected(),
    }, function(data) {
      var result_columns, result_rable_rows, result_rows, result_table, result_table_header, row_counter;
      if (data.error !== void 0) {
        SPARQL.flash_error(data.description);
        hide_loading();
      } else {
        result_columns = SPARQL.result.columns(data);
        result_rows = SPARQL.result.rows(data);
        $("#sparql_results_time_taken").html(SPARQL.result.time_taken(data).toString() + " s");
        result_table = $("#sparql_results_table");
        result_table_header = "<tr><th>#</th>";
        $.each(result_columns, function(key, val) {
          return result_table_header += "<th>" + val + "</th>";
        });
        result_table_header += "</tr>";
        result_table.find("thead").first().html(result_table_header);
        hide_loading();
        result_table.find("tbody").first().html("");
        $("#sparql_results_container").show("fast");
        row_counter = 0;
        while (row_counter < result_rows.length) {
          row_counter++;
          result_rable_rows = "<tr><td>" + row_counter.toString() + "</td>";
          $.each(result_columns, function(key, col) {
            return result_rable_rows += display_sparql_row_entry(result_rows[row_counter - 1][col]);
          });
          result_rable_rows += "</tr>";
          result_table.find("tbody").first().append(result_rable_rows);
        }
        Utils.scroll_to('#sparql_results_container');
      }
    });
  }
};

this.show_sparql_download_modal = function() {
  if (SPARQL.textbox.is_valid()) {
    $("#sparql_download_modal").modal("show");
    QueryBuilder.convert.configured.hide_download();
    return QueryBuilder.convert.json.hide_download();
  }
};

this.get_uri_element_val = function(uri) {
  var break_index, i;
  break_index = null;
  i = uri.length - 1;
  while (i >= 0) {
    if (uri.charAt(i) === "/" || uri.charAt(i) === "#") {
      break_index = i;
      break;
    }
    i--;
  }
  return uri.substring(i + 1, uri.length).replace(/[^0-9a-z]/i).toUnderscore();
};
