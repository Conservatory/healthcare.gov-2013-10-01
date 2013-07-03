<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:output method="text" omit-xml-declaration="yes" indent="no" media-type="text/plain"/>
	<xsl:strip-space elements="*"/>
	<!-- **********************************************************************
  			build variables based on query string
  ************************************************************************ -->

	<xsl:variable name="callback">
	  <xsl:for-each select="/GSP/PARAM[(@name = 'callback')]">
	    <xsl:value-of select="@value"/>
	  </xsl:for-each>
	</xsl:variable>

	<!-- **********************************************************************
  			sub-templates
  ************************************************************************ -->

	<xsl:template match="/">
		<xsl:choose>
	    <xsl:when test="$callback=''"><xsl:call-template name="json" /></xsl:when>
	    <xsl:otherwise><xsl:value-of select="$callback"/>(<xsl:call-template name="json" />);</xsl:otherwise>
	  </xsl:choose>
	</xsl:template>

  <xsl:template name="json">{
    <xsl:if test="CT">"CT": "<xsl:value-of select="CT"/>",</xsl:if>
    <xsl:if test="CUSTOM">"CUSTOM": "<xsl:value-of select="CUSTOM"/>",</xsl:if>
    "PARAM": {<xsl:apply-templates select="/GSP/PARAM"/>},
    "Q": "<xsl:value-of select="/GSP/Q"/>",
    <xsl:if test="/GSP/GM">"GM": [<xsl:apply-templates select="/GSP/GM"/>],</xsl:if>
    <xsl:if test="/GSP/RES">"RES": <xsl:apply-templates select="/GSP/RES"/>,</xsl:if>
    "TM": <xsl:value-of select="/GSP/TM"/>
  }</xsl:template>
 
  <xsl:template match="PARAM">
    "<xsl:value-of select="@name"/>": {
      "value": "<xsl:value-of select="@value"/>",
      "original_value": "<xsl:value-of select="@original_value"/>"
    }<xsl:if test="position()!=last()">,</xsl:if>
  </xsl:template>
  
  <xsl:template match="GM">{
    <xsl:if test="GL">"GL": "<xsl:value-of select="GL"/>",</xsl:if>
    <xsl:if test="GD">"GD": "<xsl:value-of select="GD"/>"</xsl:if>
    }<xsl:if test="position()!=last()">,</xsl:if>
  </xsl:template>
 
  <xsl:template match="RES">{
    "SN": "<xsl:value-of select="@SN"/>",
    "EN": "<xsl:value-of select="@EN"/>",
    <xsl:if test="FI">"FI": true,</xsl:if>
    <xsl:if test="XT">"XT": true,</xsl:if>
    "M": "<xsl:value-of select="M"/>",
    <xsl:if test="NB">"NB": <xsl:apply-templates select="NB"/>,</xsl:if>
    "R": [<xsl:apply-templates select="R"/>]<xsl:choose><xsl:when test="PARM and not(PMT/@NM = '')">,</xsl:when></xsl:choose>
    <xsl:choose><xsl:when test="PARM and not(PMT/@NM = '')">"PARM": <xsl:apply-templates select="PARM"/></xsl:when></xsl:choose>
  }</xsl:template>
  
  <xsl:template match="NB">{
    <xsl:if test="PU">"PU": "<xsl:value-of select="PU"/>"<xsl:if test="NU">,</xsl:if></xsl:if>
    <xsl:if test="NU">"NU": "<xsl:value-of select="NU"/>"</xsl:if>
  }</xsl:template>
  
  <xsl:template match="R">{
    <xsl:if test="CRAWLDATE">"CRAWLDATE": "<xsl:value-of select="CRAWLDATE"/>",</xsl:if>
    "FS": [<xsl:apply-templates select="FS"/>],
    "HAS": {<xsl:apply-templates select="HAS"/>},
    <xsl:if test="HN">"HN": {"U": "<xsl:value-of select="HN/@U"/>"},</xsl:if>
    "LANG": "<xsl:value-of select="LANG"/>",
    "MT": {<xsl:apply-templates select="MT"/>},
    "RK": <xsl:value-of select="RK"/>,
    <xsl:if test="S">"S": "<xsl:value-of select="S"/>",</xsl:if>
    <xsl:if test="T">"T": "<xsl:value-of select="T"/>",</xsl:if>
    "U": "<xsl:value-of select="U"/>",
    "UD": "<xsl:value-of select="UD"/>",
    "UE": "<xsl:value-of select="UE"/>"
  }<xsl:if test="position()!=last()">,</xsl:if></xsl:template>
  
  <xsl:template match="MT">
    "<xsl:value-of select="@N"/>": "<xsl:call-template name="escape_quot"><xsl:with-param name="string" select="@V"/></xsl:call-template>"<xsl:if test="position()!=last()">,</xsl:if>
  </xsl:template>
  
  <xsl:template match="FS">
    { "<xsl:value-of select="@NAME"/>": "<xsl:value-of select="@VALUE"/>" }<xsl:if test="position()!=last()">,</xsl:if>
  </xsl:template>
  
  <xsl:template match="HAS">
    <xsl:if test="L">"L": true<xsl:if test="C">,</xsl:if></xsl:if>
    <xsl:if test="C">"C": {<xsl:apply-templates select="C"/>}</xsl:if>
  </xsl:template>
  
  <xsl:template match="C">
    "SZ": "<xsl:value-of select="@SZ"/>",
    "CID": "<xsl:value-of select="@CID"/>"
  </xsl:template>
  
  <xsl:template match="PARM">{
    "PC": <xsl:value-of select="PC"/>,
    "PMT": [<xsl:apply-templates select="PMT"/>]
  }</xsl:template>
  
  <xsl:template match="PMT">{
    "NM": "<xsl:value-of select="@NM"/>",
    "PV": {<xsl:apply-templates select="PV"/>}
  }</xsl:template>
  
  <xsl:template match="PV">
    "<xsl:value-of select="@V"/>": <xsl:value-of select="@C"/><xsl:if test="position()!=last()">,</xsl:if>
  </xsl:template>
  
  <!-- *** quote escaping *** -->
  <xsl:template name="escape_quot">
    <xsl:param name="string"/>
    <xsl:call-template name="replace_string">
      <xsl:with-param name="find" select="'&quot;'"/>
      <xsl:with-param name="replace" select="'&amp;quot;'"/>
      <xsl:with-param name="string" select="$string"/>
    </xsl:call-template>
  </xsl:template>

  <!-- *** Find and replace *** -->
  <xsl:template name="replace_string">
    <xsl:param name="find"/>
    <xsl:param name="replace"/>
    <xsl:param name="string"/>
    <xsl:choose>
      <xsl:when test="contains($string, $find)">
        <xsl:value-of select="substring-before($string, $find)"/>
        <xsl:value-of select="$replace"/>
        <xsl:call-template name="replace_string">
          <xsl:with-param name="find" select="$find"/>
          <xsl:with-param name="replace" select="$replace"/>
          <xsl:with-param name="string"
            select="substring-after($string, $find)"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$string"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>