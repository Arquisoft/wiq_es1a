<Box p={6} borderWidth="1px" maxWidth={"90%"} borderRadius="lg" boxShadow="lg">
  <Box>
    <Heading as="h2" mb={4}>
      {t("pages.wisebattery.question")} {indicePregunta + 1}
    </Heading>
    <p>{preguntaActual.pregunta}</p>
    <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
      {preguntaActual.respuestas.map((respuesta, index) => (
        <Button
          key={index}
          onClick={() => handleSiguientePregunta(respuesta)}
          disabled={tiempoRestante === 0 || juegoTerminado}
          whiteSpace={"normal"}
          padding={"1rem"}
          height={"fit-content"}
          minHeight={"3rem"}
        >
          {respuesta}
        </Button>
      ))}
    </Grid>
  </Box>
</Box>;
