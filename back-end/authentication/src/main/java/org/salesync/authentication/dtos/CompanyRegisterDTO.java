package org.salesync.authentication.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanyRegisterDTO {
    @JsonProperty("admin_info")
    private NewUserDTO adminInfo;
    @JsonProperty("employees")
    private int noEmployees;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("country_region")
    private String countryRegion;
}